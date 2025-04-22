import { create } from "zustand";
import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";
import { handleUpload, uploadReceipt } from "../utils/uploadPhotos";
import { checkImageAvailability } from "../utils/downloadPhotos";

type Photo = {
  id: number;
  file: File;
  state: "uploading" | "processing" | "ready" | "error";
  message: string | null;
  uploadReceipt: uploadReceipt | null;
};

type PhotoState = {
  photos: Photo[];
  addFiles: (files: File[]) => void;
};

//This only exist to shut ESLint up
type SetPhotoState = {
  (
    partial:
      | PhotoState
      | Partial<PhotoState>
      | ((state: PhotoState) => PhotoState | Partial<PhotoState>),
    replace?: false,
  ): void;
  (
    state: PhotoState | ((state: PhotoState) => PhotoState),
    replace: true,
  ): void;
};

const addFiles = (files: File[]) => {
  return (set: SetPhotoState): void => {
    const photos: Photo[] = [];
    files.forEach((file) => {
      const photo: Photo = {
        id: generateId(),
        file: file,
        state: "uploading",
        message: null,
        uploadReceipt: null,
      };
      photos.push(photo);
      set((state: PhotoState) => ({ photos: [...state.photos, photo] }));
    });

    photos.forEach((photo) => {
      console.log(`starting ${photo.id}`);
      const processPhoto = async () => {
        let uploadReceipt: uploadReceipt;
        const uploadResult = await handleUpload(photo);
        if (uploadResult.isSuccess()) {
          console.log(`uploading ${photo.id} is success!`);
          uploadReceipt = uploadResult.value;
          setPhotoState(photo.id, "processing", null, uploadResult.value);
        } else {
          console.log(
            `uploading ${photo.id} failed, ${uploadResult.error.message}`,
          );
          setPhotoState(photo.id, "error", uploadResult.error.message);
          return;
        }

        console.log(`now we're polling for download ${photo.id}`);
        const checkImageAvailabilityResult = await checkImageAvailability(
          uploadReceipt.futureImageUrl,
        );
        if (checkImageAvailabilityResult.isSuccess()) {
          console.log(`${photo.id} is ready to download`);
          setPhotoState(photo.id, "ready", null, uploadResult.value);
        } else {
          console.log(`${photo.id} couldn't be processed!`);
          setPhotoState(
            photo.id,
            "error",
            checkImageAvailabilityResult.error.message,
          );
        }
        return;
      };
      processPhoto();
    });
  };
};

const usePhotoStore = create<PhotoState>((set) => ({
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
  newState: "uploading" | "processing" | "ready" | "error",
  newMessage: string | null = null,
  newUploadReceipt: uploadReceipt | null = null,
): Either<true, CustomError> => {
  const { photos } = usePhotoStore.getState();
  if (newState == "error" && newMessage == null) {
    throw "error state should have message";
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
export { getPhoto, removePhoto };
export type { Photo, PhotoState };
