import { styled } from "styled-components";
import { useState, FormEvent, useCallback } from "react";
import PhotoUploader from "./components/PhotoUploader";
import { SubmitButton, DownloadButton as ButtonComponent } from "./components/Buttons";
import { Photo } from "./types";
import validatePhotos from "./utils/validatePhotos";
import CustomError from "./types/errors";
import { uploadPhotoReceipt, uploadPhotos } from "./utils/uploadPhotos";
import attemptDownload from "./utils/downloadPhotos";

const Container = styled.div`
  padding: 2rem;
`;

// Simple success message container
const SuccessContainer = styled.div`
  border: 2px dashed #4f46e5;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  background-color: rgba(79, 70, 229, 0.05);
`;

const SuccessMessage = styled.p`
  font-size: 1.125rem;
  color: #4f46e5;
  margin-bottom: 1.5rem;
`;

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const errors: CustomError[] = [];
    let isValid: true | undefined;

    validatePhotos(photos)
      .onSuccess(() => {
        isValid = true
      })
      .onFailure((value) => {
        errors.concat(value);
      })
    if (!isValid)
      return

    setIsUploading(true);
    setUploadProgress(0);

    const receipt = await uploadPhotos(photos)
    receipt[0]
      .onSuccess((value) => {
        attemptDownload(value.futureImageUrl);
    })
      .onFailure(() => {
        console.error("oh well")
      })

  }, [photos])

  return (
    <Container className="max-w-full max-h-full">
      <Container>
        {true ? (
          // Upload view
          <>
            <PhotoUploader 
              photos={photos}
              onPhotosChange={setPhotos}
            />
            
            {error && (
              <div style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            
            {photos.length > 0 && (
              <SubmitButton 
                photoCount={photos.length}
                onSubmit={handleSubmit}
                disabled={isUploading}
              >
                {isUploading 
                  ? `Uploading... ${uploadProgress}%` 
                  : `Upload ${photos.length} Photo${photos.length !== 1 ? 's' : ''}`
                }
              </SubmitButton>
            )}
          </>
        ) : (
          // Simple success view with download button
          <SuccessContainer>
            <SuccessMessage>
              Your pictures have been deblurred successfully!
            </SuccessMessage>
            
            {/* <ButtonComponent 
              onClick={handleDownloadAll}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download All"}
            </ButtonComponent> */}
          </SuccessContainer>
        )}
      </Container>
    </Container>
  );
}

export default App;
