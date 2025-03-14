import { styled } from "styled-components";
import { useState, FormEvent, useCallback } from "react";
import PhotoUploader from "./components/PhotoUploader";
import { SubmitButton } from "./components/Buttons";
import { Photo } from "./types";

const Container = styled.div`
  padding: 2rem;
`;

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    if (photos.length === 0) return;
    
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
        // Add any other metadata you need per photo
        size: photo.file.size,
      }));

      const payload = {
        photos: photoData,
        metadata: {
          totalPhotos: photos.length,
          timestamp: new Date().toISOString(),
          // Add any other metadata needed for processing
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
          // Add any required headers like API keys or auth tokens
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
      alert("Failed to upload photos. Please try again.");
    }
  }, [photos]);

  return (
    <Container className="max-w-full max-h-full">
      <Container>
        <PhotoUploader 
          photos={photos}
          onPhotosChange={setPhotos}
        />
        
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