import { Photo } from "../store/photos";

type PhotoDisplayProps = {
  photo: Photo;
  imageUrl: string | null;
};

const PhotoImage: React.FC<PhotoDisplayProps> = ({ photo, imageUrl }) => {
  return (
    <div className="max-w-64 max-h-64 flex-shrink-0 flex items-center justify-self-end overflow-hidden">
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
  );
};

export default PhotoImage;
