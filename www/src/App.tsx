import { styled } from "styled-components";
import { useState, FormEvent, useCallback } from "react";
import PhotoUploader from "./components/PhotoUploader";
import { SubmitButton } from "./components/Buttons";
import { Photo } from "./types";

// Define allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

const Container = styled.div`
  padding: 2rem;
`;

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validatePhotos = (photosToValidate: Photo[]): boolean => {
    for (const photo of photosToValidate) {
      // Check MIME type
      if (!ALLOWED_FILE_TYPES.includes(photo.file.type)) {
        setError(`Invalid file type: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`);
        return false;
      }
      
      // Additional check on file extension
      const fileName = photo.file.name.toLowerCase();
      const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
      
      if (!hasValidExtension) {
        setError(`Invalid file extension: ${photo.file.name}. Only JPG, JPEG, and PNG files are allowed.`);
        return false;
      }
      
      // Optionally check file size
      if (photo.file.size > 10 * 1024 * 1024) { // 10MB limit
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
    
    // Validate photos before uploading
    if (!validatePhotos(photos)) {
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // AWS Lambda API Gateway endpoint URL
      const lambdaEndpoint = "https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/upload-photos";

      // Create photo data payload
      const photoData = photos.map(photo => ({
        name: photo.file.name,
        type: photo.file.type,
        // Use existing dataURL but remove the prefix
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

      // Set initial progress
      setUploadProgress(10);
      
      // Send request to Lambda
      const response = await fetch(lambdaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Update progress after sending
      setUploadProgress(90);

      // Handle response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      
      // Upload complete
      setUploadProgress(100);
      console.log("Upload successful:", result);
      
      // Clear the photos after successful upload
      setPhotos([]);
      
      // Reset upload state after a brief delay to show completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error uploading photos:", error);
      setIsUploading(false);
      setUploadProgress(0);
      setError(error instanceof Error ? error.message : "Failed to upload photos. Please try again.");
    }
  }, [photos]);

  return (
    <Container className="max-w-full max-h-full">
      <Container>
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
      </Container>
    </Container>
  );
}

export default App;