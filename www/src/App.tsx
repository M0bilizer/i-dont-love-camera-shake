import { styled } from "styled-components";
import { useState, FormEvent, useCallback } from "react";
import PhotoUploader from "./components/PhotoUploader";
import { SubmitButton, DownloadButton as ButtonComponent } from "./components/Buttons";
import { Photo } from "./types";

// Define allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

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


// Interface for processed image data returned from the backend
interface ProcessedImage {
  id: string;
  originalName: string;
  processedUrl: string;
  size: number;
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const validatePhotos = (photosToValidate: Photo[]): boolean => {
    for (const photo of photosToValidate) {
      if (!ALLOWED_FILE_TYPES.includes(photo.file.type)) {
        setError(`Invalid file type: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`);
        return false;
      }
      
      const fileName = photo.file.name.toLowerCase();
      const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        setError(`Invalid file extension: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`);
        return false;
      }
      
      if (photo.file.size > 10 * 1024 * 1024) {
        setError(`File too large: ${photo.file.name}. Maximum size is 10MB.`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    if (photos.length === 0) return;
    
    setError(null);
    
    if (!validatePhotos(photos)) {
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const lambdaEndpoint = "https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/upload-photos";

      const photoData = photos.map(photo => ({
        name: photo.file.name,
        type: photo.file.type,
        data: photo.url.split(',')[1], 
        lastModified: photo.file.lastModified,
        size: photo.file.size,
      }));

      const payload = {
        photos: photoData,
        metadata: {
          totalPhotos: photos.length,
          timestamp: new Date().toISOString(),
          clientInfo: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
          }
        }
      };

      setUploadProgress(10);
      
      const response = await fetch(lambdaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      setUploadProgress(100);
      
      if (result.processedImages && Array.isArray(result.processedImages)) {
        setProcessedImages(result.processedImages);
        
        setTimeout(() => {
          setIsProcessed(true);
          setIsUploading(false);
        }, 1000);
      } else {
        console.warn("Unexpected response format:", result);
        throw new Error("Server returned an invalid response format.");
      }
      
    } catch (error) {
      console.error("Error uploading photos:", error);
      setIsUploading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : "Failed to upload photos. Please try again.");
    }
  }, [photos]);

  const handleDownloadAll = async () => {
    if (processedImages.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      for (const image of processedImages) {
        await downloadImage(image.processedUrl, image.originalName);
      }
      
      setIsDownloading(false);
    } catch (error) {
      console.error("Error downloading images:", error);
      setIsDownloading(false);
      setError("Failed to download one or more images. Please try again.");
    }
  };

  const downloadImage = async (url: string, fileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = `deblurred_${fileName}`;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(resolve, 500);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <Container className="max-w-full max-h-full">
      <Container>
        {!isProcessed ? (
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
            
            <ButtonComponent 
              onClick={handleDownloadAll}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download All"}
            </ButtonComponent>
          </SuccessContainer>
        )}
      </Container>
    </Container>
  );
}

export default App;