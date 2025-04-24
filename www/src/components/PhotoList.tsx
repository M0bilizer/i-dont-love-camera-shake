import React, { useState } from "react";
import usePhotoStore, { Photo, PhotoStore } from "../store/photos";
import PhotoDisplay from "./PhotoDisplay";

const PhotoList: React.FC = () => {
  const [photos, setPhoto] = useState<Photo[]>(usePhotoStore().photos);
  usePhotoStore.subscribe((state: PhotoStore) => {
    setPhoto(state.photos);
  });

  return (
    <div className="p-2 sm:p-10 flex justify-center items-center">
      <div className="w-auto inline-grid grid-cols-1 gap-2">
        {photos.map((photo, index) => (
          <PhotoDisplay key={index} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default PhotoList;
