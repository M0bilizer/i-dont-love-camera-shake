import React, { MouseEvent } from "react";
import { Photo, PhotoStatus } from "../store/photos";

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
  if (photo.status === PhotoStatus.Ready)
    return (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded bg-green-600 px-2.5 py-1 text-center text-white transition-colors hover:bg-green-700 sm:px-5 sm:py-2.5"
        >
          Download Processed Image
        </button>
        <span className="text-sm text-gray-500">Ready for download</span>
      </div>
    );
  if (photo.status === PhotoStatus.PollingError)
    return (
      <div>
        <h3 className="mt-0 mb-2 text-gray-800">Status: Processing Failed!</h3>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded bg-gray-600 px-2.5 py-1 text-center text-white transition-colors hover:bg-green-700 sm:px-5 sm:py-2.5"
        >
          Try Again?
        </button>
      </div>
    );
  return (
    <div>
      <h3 className="mt-0 mb-2 text-gray-800">Status: {photo.status}</h3>
      {photo.message && <p>{photo.message}</p>}
    </div>
  );
};

export default PhotoDescription;
