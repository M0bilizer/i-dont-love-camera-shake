import { useState, useEffect, MouseEvent } from "react";
import { Photo } from "../store/photos.ts";
import { downloadImage } from "../utils/downloadPhotosHelper.ts";
import { retryPolling, removePhoto } from "../utils/photosHelper.ts";
import CloseButton from "./CloseButton.tsx";
import PhotoDescription from "./PhotoDescription.tsx";
import PhotoImage from "./PhotoImage.tsx";

type PhotoDisplayProps = {
  photo: Photo;
};

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photo }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDownload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (photo.status === "ready" && photo.uploadReceipt?.futureImageUrl) {
      downloadImage(photo.uploadReceipt.futureImageUrl, photo.file.name);
    }
  };

  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    retryPolling(photo.id);
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
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="inline-grid grid-cols-2 gap-x-2 rounded-lg border border-gray-200 bg-white p-2">
        <div className="justify-self-start">
          <PhotoImage photo={photo} imageUrl={imageUrl} />
        </div>
        <div className="justify-self-start">
          <PhotoDescription
            photo={photo}
            handleDownload={handleDownload}
            handleRetry={handleRetry}
          />
        </div>
      </div>

      <div className="justify-self-start align-middle">
        <CloseButton handleClose={handleClose} />
      </div>
    </div>
  );
};

export default PhotoDisplay;
