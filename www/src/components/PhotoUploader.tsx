import { styled } from "styled-components";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import PhotoItem from "./PhotoItem";
import { DropForm } from "./DropForm";
import { Photo } from "../types";

const PhotoUploaderContainer = styled.form`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  
  &.drag-active {
    border-color: #4f46e5;
    background-color: rgba(79, 70, 229, 0.1);
  }
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const AddMoreButton = styled.button`
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  border: 1px dashed #4f46e5;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  font-size: 2rem;
  
  &:hover {
    background-color: rgba(79, 70, 229, 0.2);
  }
`;

interface PhotoUploaderProps {
  onPhotosChange: (photos: Photo[]) => void;
  photos: Photo[];
}

const PhotoUploader = ({ onPhotosChange, photos }: PhotoUploaderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newPhotos = [...photos];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && e.target.result) {
            newPhotos.push({
              id: Date.now() + i,
              url: e.target.result as string,
              file: file
            });
            onPhotosChange([...newPhotos]);
          }
        };
        
        reader.readAsDataURL(file);
      }
    }
  };

  const removePhoto = (id: number) => {
    onPhotosChange(photos.filter(photo => photo.id !== id));
  };

  return (
    <PhotoUploaderContainer 
      className={isDragging ? "drag-active" : ""}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DropForm
        hasPhotos={photos.length > 0}
        fileInputRef={fileInputRef}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*" 
          style={{ display: 'none' }}
        />
        <p>Drag & drop photos here or click to select</p>
      </DropForm>

      {photos.length > 0 && (
        <PhotosGrid>
          {photos.map((photo) => (
            <PhotoItem 
              key={photo.id}
              photo={photo}
              onDelete={removePhoto}
            />
          ))}
          
          <AddMoreButton 
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            +
          </AddMoreButton>
        </PhotosGrid>
      )}
    </PhotoUploaderContainer>
  );
};

export default PhotoUploader;