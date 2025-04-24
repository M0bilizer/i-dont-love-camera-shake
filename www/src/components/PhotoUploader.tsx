import React, { ChangeEvent, DragEvent } from "react";
import CustomError from "../types/errors";
import { validateForUpload } from "../utils/validate";
import usePhotoStore from "../store/photos";

const ImageUploadBox: React.FC = () => {
  const { addFiles } = usePhotoStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleErrors = (errors: CustomError[]) => {
    const errorMessages = errors.map((it) => it.message);
    setErrorMessage(errorMessages.join("\n"));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const { validFiles, errors } = validateForUpload(droppedFiles);
    addFiles(validFiles);
    if (errors.length > 0) {
      handleErrors(errors);
    } else {
      setErrorMessage(null);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const { validFiles, errors } = validateForUpload(selectedFiles);
    addFiles(validFiles);
    if (errors.length > 0) {
      handleErrors(errors);
    } else {
      setErrorMessage(null);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        {errorMessage && (
          <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {errorMessage}
          </div>
        )}
        <div
          className="mb-0 flex h-[200px] min-h-[100px] w-[300px] cursor-pointer items-center justify-center border-2 border-dashed border-gray-300 p-8 text-center"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Drag & Drop images here or click to select files</p>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            multiple
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploadBox;
