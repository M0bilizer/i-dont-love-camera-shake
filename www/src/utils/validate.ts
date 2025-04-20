import { Either, failure, match, success } from "../types/either";
import CustomError from "../types/errors";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

const validateFile = (file: File): Either<true, CustomError> => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return failure(
      new CustomError(
        `Invalid file type: ${file.name}. Only JPG, JPEG, and PNG files are allowed.`,
      ),
    );
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext),
  );
  if (!hasValidExtension) {
    return failure(
      new CustomError(
        `Invalid file extension: ${file.name}. Only JPG, JPEG, and PNG files are allowed.`,
      ),
    );
  }
  return success(true);
};

const validateForUpload = (
  files: File[],
): { validFiles: File[]; errors: CustomError[] } => {
  const validFiles: File[] = [];
  const errors: CustomError[] = [];
  for (const file of files) {
    const result = validateFile(file);
    match(
      result,
      () => validFiles.push(file),
      (error) => errors.push(error),
    );
  }
  return { validFiles: validFiles, errors: errors };
};

export { validateFile, validateForUpload };
export default validateFile;
