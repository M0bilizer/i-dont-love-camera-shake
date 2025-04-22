import React, { useState } from "react";
import usePhotoStore, { Photo, PhotoState } from "../store/photos";
import PhotoDisplay from "./PhotoDisplay";

const PhotoList: React.FC = () => {
  const [photos, setPhoto] = useState<Photo[]>(usePhotoStore().photos);
  usePhotoStore.subscribe((state: PhotoState) => {
    setPhoto(state.photos);
  });

  return (
    <div className="p-10">
      <div className="flex flex-col gap-2 px-72">
        {photos.map((photo, index) => (
          <PhotoDisplay key={index} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default PhotoList;
