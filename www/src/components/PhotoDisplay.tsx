import React, { useState, useEffect, MouseEvent } from "react";
import { Photo, removePhoto } from "../store/photos";
import { downloadImage } from "../utils/downloadPhotos";
import PhotoImage from "./PhotoImage";
import PhotoDescription from "./PhotoDescription";
import CloseButton from "./CloseButton";

type PhotoDisplayProps = {
  photo: Photo;
};

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photo }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDownload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (photo.state === "ready" && photo.uploadReceipt?.futureImageUrl) {
      downloadImage(photo.uploadReceipt.futureImageUrl, photo.file.name);
    }
  };

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    removePhoto(photo.id);
  };

  useEffect(() => {
    const url = URL.createObjectURL(photo.file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.file]);

  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <div className="inline-grid p-2 grid-cols-2 gap-x-2 border border-gray-200 rounded-lg bg-white">
        <div className="justify-self-start">
          <PhotoImage photo={photo} imageUrl={imageUrl} />
        </div>
        <div className="justify-self-start">
          <PhotoDescription photo={photo} handleDownload={handleDownload} />
        </div>
      </div>

      <div className="justify-self-start align-middle">
        <CloseButton handleClose={handleClose} />
      </div>
    </div>
  );
};

export default PhotoDisplay;
