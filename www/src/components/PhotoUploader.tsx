import React, { ChangeEvent, DragEvent } from 'react';
import styled from 'styled-components';
import CustomError from '../types/errors';
import { validateForUpload } from '../utils/validate';
import { useFileStore } from '../store/photos';

const Container = styled.div`
  text-align: center;
  cursor: pointer;
  padding: 2rem;
  margin-bottom: 0;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  width: 300px;
  height: 200px;
`;

const ErrorBox = styled.div`
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #721c24;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const ImageUploadBox: React.FC = () => {
  const { addFiles } = useFileStore();
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
    document.getElementById('fileInput')?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
        <Container onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver}>
          <p>Drag & Drop images here or click to select files</p>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            multiple
          />
        </Container>
      </div>
    </div>
  );
};

export default ImageUploadBox;
