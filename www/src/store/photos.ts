import { create } from "zustand";
import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";
import { handleUpload, uploadReceipt } from "../utils/uploadPhotos";
import { checkImageAvailability } from "../utils/downloadPhotos";

enum PhotoStatus {
  Uploading = "uploading",
  Processing = "processing",
  Ready = "ready",
  UploadingError = "uploadingError",
  PollingError = "pollingError",
}

type Photo = {
  id: number;
  file: File;
  state: PhotoStatus;
  message: string | null;
  uploadReceipt: uploadReceipt | null;
};

type PhotoStore = {
  photos: Photo[];
  addFiles: (files: File[]) => void;
};

//This only exist to shut ESLint up
type SetPhotoStore = {
  (
    partial:
      | PhotoStore
      | Partial<PhotoStore>
      | ((state: PhotoStore) => PhotoStore | Partial<PhotoStore>),
    replace?: false,
  ): void;
  (
    state: PhotoStore | ((state: PhotoStore) => PhotoStore),
    replace: true,
  ): void;
};

const addFiles = (files: File[]) => {
  return (set: SetPhotoStore): void => {
    const photos: Photo[] = [];
    files.forEach((file) => {
      const photo: Photo = {
        id: generateId(),
        file: file,
        state: PhotoStatus.Uploading,
        message: null,
        uploadReceipt: null,
      };
      photos.push(photo);
      set((state: PhotoStore) => ({ photos: [...state.photos, photo] }));
    });

    photos.forEach((photo) => {
      console.log(`starting ${photo.id}`);
      const processPhoto = async () => {
        let uploadReceipt: uploadReceipt;
        const uploadResult = await handleUpload(photo);
        if (uploadResult.isSuccess()) {
          console.log(`uploading ${photo.id} is success!`);
          uploadReceipt = uploadResult.value;
          setPhotoState(
            photo.id,
            PhotoStatus.Processing,
            null,
            uploadResult.value,
          );
        } else {
          console.log(
            `uploading ${photo.id} failed, ${uploadResult.error.message}`,
          );
          setPhotoState(
            photo.id,
            PhotoStatus.UploadingError,
            uploadResult.error.message,
          );
          return;
        }

        console.log(`now we're polling for download ${photo.id}`);
        const checkImageAvailabilityResult = await checkImageAvailability(
          uploadReceipt.futureImageUrl,
        );
        if (checkImageAvailabilityResult.isSuccess()) {
          console.log(`${photo.id} is ready to download`);
          setPhotoState(photo.id, PhotoStatus.Ready, null, uploadResult.value);
        } else {
          console.log(`${photo.id} couldn't be processed!`);
          setPhotoState(
            photo.id,
            PhotoStatus.PollingError,
            checkImageAvailabilityResult.error.message,
            uploadResult.value,
          );
        }
        return;
      };
      processPhoto();
    });
  };
};

const retryPolling = async (id: number) => {
  const photo = getPhoto(id);
  if (photo.isFailure()) {
    throw "Cannot find photo!";
  }
  const uploadReceipt = photo.value.uploadReceipt;
  if (uploadReceipt == null) {
    throw "Photo should have been uploaded!";
  }
  setPhotoState(id, PhotoStatus.Processing, null, uploadReceipt);
  const checkImageAvailabilityResult = await checkImageAvailability(
    uploadReceipt.futureImageUrl,
  );
  if (checkImageAvailabilityResult.isSuccess()) {
    console.log(`${id} is ready to download`);
    setPhotoState(id, PhotoStatus.Ready, null, uploadReceipt);
  } else {
    console.log(`${id} couldn't be processed!`);
    setPhotoState(
      id,
      PhotoStatus.PollingError,
      checkImageAvailabilityResult.error.message,
    );
  }
};

const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  addFiles: (files) => addFiles(files)(set),
}));

/*
 * █░█ █▀▀ █░░ █▀█ █▀▀ █▀█   █▀▀ █░█ █▄░█ █▀▀ ▀█▀ █ █▀█ █▄░█ █▀
 * █▀█ ██▄ █▄▄ █▀▀ ██▄ █▀▄   █▀░ █▄█ █░▀█ █▄▄ ░█░ █ █▄█ █░▀█ ▄█
 **/

const generateId = (): number => {
  const currentPhotos = usePhotoStore.getState().photos;
  let newId = currentPhotos.length;

  while (currentPhotos.some((photo) => photo.id === newId)) {
    newId = newId + 1;
  }

  return newId;
};

const setPhotoState = (
  id: number,
  newState: PhotoStatus,
  newMessage: string | null = null,
  newUploadReceipt: uploadReceipt | null = null,
): Either<true, CustomError> => {
  const { photos } = usePhotoStore.getState();
  if (newState == PhotoStatus.UploadingError && newMessage == null) {
    throw "uploading error state should have message";
  }
  if (newState == "processing" && newUploadReceipt == null) {
    throw "processing state should have uploadReceipt";
  }

  if (!photos.some((p) => p.id === id)) {
    return failure(new CustomError("Cannot find file!"));
  }

  usePhotoStore.setState({
    photos: photos.map((photo) =>
      photo.id === id
        ? {
            ...photo,
            state: newState,
            message: newMessage,
            uploadReceipt: newUploadReceipt,
          }
        : photo,
    ),
  });

  return success(true);
};

const removePhoto = (id: number): Either<true, CustomError> => {
  const { photos } = usePhotoStore.getState();
  console.log(photos);
  if (!photos.some((p) => p.id === id)) {
    return failure(new CustomError("Cannot find file!"));
  }

  usePhotoStore.setState({
    photos: photos.filter((photo) => photo.id !== id),
  });

  return success(true);
};

const getPhoto = (id: number): Either<Photo, CustomError> => {
  const { photos } = usePhotoStore.getState();
  const photo = photos.find((p) => p.id === id);
  if (!photo) {
    return failure(new CustomError("Cannot find photo!"));
  }
  return success(photo);
};

export default usePhotoStore;
export { getPhoto, removePhoto, retryPolling, PhotoStatus as PhotoState };
export type { Photo, PhotoStore };
