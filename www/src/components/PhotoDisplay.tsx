import React, { useState, useEffect, MouseEvent } from "react";
import { Photo } from "../store/photos";
import { downloadImage } from "../utils/downloadPhotos";

type PhotoDisplayProps = {
  photo: Photo;
};

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ photo }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDownload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (photo.state === "ready" && photo.uploadReceipt?.futureImageUrl) {
      console.log("help");
      downloadImage(photo.uploadReceipt.futureImageUrl, photo.file.name);
    }
  };

  useEffect(() => {
    const url = URL.createObjectURL(photo.file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo.file]);

  return (
    <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg mb-3 bg-white">
      <div className="w-64 h-64 flex-shrink-0 flex items-center justify-center overflow-hidden">
        {photo.state === "ready" && photo.uploadReceipt?.futureImageUrl ? (
          <img
            src={photo.uploadReceipt.futureImageUrl}
            alt="Processed result"
            className="w-full h-full object-contain"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded text-gray-500">
            {photo.state === "ready" ? "Processed Image" : "Loading..."}
          </div>
        )}
      </div>

      <div>
        {photo.state === "ready" ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 bg-green-600 text-white text-center rounded hover:bg-green-700 transition-colors"
            >
              Download Processed Image
            </button>
            <span className="text-sm text-gray-500">Ready for download</span>
          </div>
        ) : (
          <div>
            <h3 className="mt-0 mb-2 text-gray-800">Status: {photo.state}</h3>
            {photo.message && <p>{photo.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDisplay;
