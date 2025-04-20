import React from "react";
import usePhotoStore, { PhotoState } from "../store/photos";

const FileList: React.FC = () => {
  const { photos }: PhotoState = usePhotoStore();

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {photos.map((photo, index) => (
          <li key={index}>
            id:{photo.id} state:{photo.state} {photo.message} {photo.uploadReceipt?.futureImageUrl}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
