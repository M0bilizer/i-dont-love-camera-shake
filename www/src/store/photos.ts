import { create } from "zustand";
import { checkImageAvailability } from "../utils/downloadPhotosHelper.ts";
import { generateId, setPhotoState } from "../utils/photosHelper.ts";
import { uploadReceipt, handleUpload } from "../utils/uploadPhotosHelper.ts";

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
  status: PhotoStatus;
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
        status: PhotoStatus.Uploading,
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

const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  addFiles: (files) => addFiles(files)(set),
}));

export default usePhotoStore;
export { PhotoStatus };
export type { Photo, PhotoStore };
