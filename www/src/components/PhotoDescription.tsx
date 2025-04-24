import React, { MouseEvent } from "react";
import { Photo } from "../store/photos";

type PhotoDescriptionProps = {
  photo: Photo;
  handleDownload: (e: MouseEvent<HTMLButtonElement>) => void;
};

const PhotoDescription: React.FC<PhotoDescriptionProps> = ({
  photo,
  handleDownload,
}) => {
  return (
    <div>
      {photo.state === "ready" ? (
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
      ) : (
        <div>
          <h3 className="mt-0 mb-2 text-gray-800">Status: {photo.state}</h3>
          {photo.message && <p>{photo.message}</p>}
        </div>
      )}
    </div>
  );
};

export default PhotoDescription;
