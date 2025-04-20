import { create, StateCreator } from "zustand";
import { Either, failure, success } from "../types/either";
import CustomError from "../types/errors";
import { handleUpload, uploadReceipt } from "../utils/uploadPhotos";

type Photo = {
  id: number;
  file: File;
  state: "uploading" | "processing" | "ready" | "error";
  message: string | null;
  uploadReceipt: uploadReceipt | null;
};

interface PhotoState {
  photos: Photo[];
  addFiles: (files: File[]) => void;
}

//This only exist to shut ESLint up
type SetPhotoState = {
  (partial: PhotoState | Partial<PhotoState> | ((state: PhotoState) => PhotoState | Partial<PhotoState>), replace?: false): void;
  (state: PhotoState | ((state: PhotoState) => PhotoState), replace: true): void;
}

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
      }
      photos.push(photo);
      set((state: PhotoState) => ({ photos: [...state.photos, photo] }));
    })

    photos.forEach((photo) => {
      console.log(`starting ${photo.id}`);
      const processPhoto = async () => {
        const result = await handleUpload(photo);
        if (result.isSuccess()) {
          console.log(`uploading ${photo.id} is success!`);
          setPhotoState(photo.id, "processing", null, result.value);
        } else {
          console.log(`uploading ${photo.id} failed, ${result.error.message}`);
          setPhotoState(photo.id, "error", result.error.message);
        }

        console.log(`now we're polling for download ${photo.id}`)
      };
      processPhoto();
    });
  };
};

const usePhotoStore = create<PhotoState>((set) => ({
  photos: [],
  addFiles: (files) => addFiles(files)(set),
}));

//Helper
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

export default usePhotoStore;
export type { Photo, PhotoState };
