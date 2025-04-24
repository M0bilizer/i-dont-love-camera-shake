import React, { MouseEvent } from "react";
import { Photo, PhotoState as PhotoState } from "../store/photos";

type PhotoDescriptionProps = {
  photo: Photo;
  handleDownload: (e: MouseEvent<HTMLButtonElement>) => void;
  handleRetry: (e: MouseEvent<HTMLButtonElement>) => void;
};

const PhotoDescription: React.FC<PhotoDescriptionProps> = ({
  photo,
  handleDownload,
  handleRetry,
}) => {
  if (photo.state === PhotoState.Ready)
    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="px-2.5 py-1 sm:px-5 sm:py-2.5 bg-green-600 text-white text-center rounded hover:bg-green-700 transition-colors"
        >
          Download Processed Image
        </button>
        <span className="text-sm text-gray-500">Ready for download</span>
      </div>
    );
  if (photo.state === PhotoState.PollingError)
    return (
      <div>
        <h3 className="mt-0 mb-2 text-gray-800">Status: Processing Failed!</h3>
        <button
          type="button"
          onClick={handleRetry}
          className="px-2.5 py-1 sm:px-5 sm:py-2.5 bg-gray-600 text-white text-center rounded hover:bg-green-700 transition-colors"
        >
          Try Again?
        </button>
      </div>
    );
  return (
    <div>
      <h3 className="mt-0 mb-2 text-gray-800">Status: {photo.state}</h3>
      {photo.message && <p>{photo.message}</p>}
    </div>
  );
};

export default PhotoDescription;
