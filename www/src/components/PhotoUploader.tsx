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
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {errorMessage}
          </div>
        )}
        <div
          className="text-center cursor-pointer p-8 mb-0 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-300 w-[300px] h-[200px]"
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
