import { ValidationResult } from '../types/result';

interface Photo {
  file: File;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const validatePhotos = (photos: Photo[]): ValidationResult => {
  const errors: Error[] = [];

  for (const photo of photos) {
    if (!ALLOWED_FILE_TYPES.includes(photo.file.type)) {
      errors.push(new Error(`Invalid file type: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`));
    }

    const fileName = photo.file.name.toLowerCase();
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      errors.push(new Error(`Invalid file extension: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`));
    }

    if (photo.file.size > 10 * 1024 * 1024) {
      errors.push(new Error(`File too large: ${photo.file.name}. Maximum size is 10MB.`));
    }
  }

  return new ValidationResult(errors);
};

export default validatePhotos;
