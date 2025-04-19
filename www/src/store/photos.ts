import {create} from 'zustand';
import { Either, failure, success } from '../types/either';
import CustomError from '../types/errors';
import { validateForProcess } from '../utils/validate';
import { handlePhoto } from '../utils/uploadPhotos';

type Photo = {
  id: number;
  file: File,
  state: "uploading" | "processing" | "ready" | "error",
}

interface PhotoState {
  photos: Photo[];
  addFile: (file: File) => Either<true, CustomError>;
  uploadPhoto: (file: File) => Either<true, CustomError>;
  PollForPhoto: (file: File) => Either<string, CustomError>;
}

const addFile = (file: File) => {
  return (set: any): Either<true, CustomError> => {
    const photo: Photo = {id: generateId(), file, state: "uploading" };
    const result = validateForProcess(photo);
    if (result.isSuccess()) {
      set((state: PhotoState) => ({
        photos: [...state.photos, photo]
      }));
      return success(true);
    } else {
      return failure(result.error)
    }
  };
};

const uploadFile = async (id: number) => {
  return (get: any): Either<true, CustomError> => {
    let photo;
    const result = getPhotoById(id);
    if (result.isSuccess()) {
      photo = result.value
    } else {
      return failure(result.error)
    }

    const uploadPhotoReceipt = await handlePhoto(photo);
    if (uploadPhotoReceipt.isSuccess()) {
      //
    } else {
      //
    }
      
  }
}

export const useFileStore = create<PhotoState>((set, get) => ({
  photos: [],
  addFile: (file) => addFile(file)(set)
}));

//Helper
const generateId = (): number => {
  const currentPhotos = useFileStore.getState().photos;
  let newId = currentPhotos.length;
  
  while (currentPhotos.some(photo => photo.id === newId)) {
    newId = newId + 1;
  }
  
  return newId;
};

const getPhotoById = (id: number): Either<Photo, CustomError> => {
  const photo = useFileStore(state => state.photos.find(p => p.id === id))
  if (!photo)
    return failure(new CustomError("Cannot find file!"));
  else
    return success(photo);
}

export type {Photo, PhotoState}