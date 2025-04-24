import usePhotoStore, { Photo, PhotoStatus } from "../store/photos";
import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";
import { checkImageAvailability } from "./downloadPhotosHelper";
import { uploadReceipt } from "./uploadPhotosHelper";

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
  newStatus: PhotoStatus,
  newMessage: string | null = null,
  newUploadReceipt: uploadReceipt | null = null,
): Either<true, CustomError> => {
  const { photos } = usePhotoStore.getState();
  if (newStatus == PhotoStatus.UploadingError && newMessage == null) {
    throw "uploading error state should have message";
  }
  if (newStatus == "processing" && newUploadReceipt == null) {
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
            status: newStatus,
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

export { retryPolling, generateId, setPhotoState, removePhoto, getPhoto };
