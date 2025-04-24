import { Photo } from "../store/photos";

type PhotoDisplayProps = {
  photo: Photo;
  imageUrl: string | null;
};

const PhotoImage: React.FC<PhotoDisplayProps> = ({ photo, imageUrl }) => {
  return (
    <div className="flex max-h-64 max-w-64 flex-shrink-0 items-center justify-self-end overflow-hidden">
      {photo.status === "ready" && photo.uploadReceipt?.futureImageUrl ? (
        <img
          src={photo.uploadReceipt.futureImageUrl}
          alt="Processed result"
          className="h-full w-full object-contain"
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded preview"
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 text-gray-500">
          {photo.status === "ready" ? "Processed Image" : "Loading..."}
        </div>
      )}
    </div>
  );
};

export default PhotoImage;
