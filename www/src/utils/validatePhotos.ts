import Either from "../types/either";
import CustomError from "../types/errors";

interface Photo {
  file: File;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const validatePhotos = (photos: Photo[]): Either<true, CustomError[]> => {
  const errors: CustomError[] = [];

  if (photos.length === 0) {
    errors.push(new CustomError(`No photos found.`))
    console.error(errors)
    return Either.failure(errors);
  }

  for (const photo of photos) {
    if (!ALLOWED_FILE_TYPES.includes(photo.file.type)) {
      errors.push(new CustomError(`Invalid file type: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`));
    }

    const fileName = photo.file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.push(new CustomError(`Invalid file extension: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`));
    }

    if (photo.file.size > 10 * 1024 * 1024) {
      errors.push(new CustomError(`File too large: ${photo.file.name}. Maximum size is 10MB.`));
    }
  }

  if (errors.length > 0) {
    console.error(errors)
    return Either.failure(errors);
  }
  return Either.success(true);
};

export default validatePhotos;
