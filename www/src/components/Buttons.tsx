import { styled } from "styled-components";
import { FormEvent, ReactNode, MouseEvent } from "react";

const Button = styled.button`
  margin: 1.5rem auto 0;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: block;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: #6b7280;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

// Download button styles
const DownloadButtonElement = styled(Button)`
  display: inline-flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

interface SubmitButtonProps {
  photoCount: number;
  onSubmit: (e: FormEvent) => void;
  disabled?: boolean;
  children?: ReactNode;
}

interface DownloadButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export const SubmitButton = ({ 
  photoCount, 
  onSubmit, 
  disabled = false,
  children 
}: SubmitButtonProps) => {
  return (
    <ButtonContainer>
      <Button 
        type="button"
        onClick={onSubmit}
        disabled={disabled}
      >
        {children || `Upload ${photoCount} Photo${photoCount !== 1 ? 's' : ''}`}
      </Button>
    </ButtonContainer>
  );
};

export const DownloadButton = ({
  onClick,
  disabled = false,
  children
}: DownloadButtonProps) => {
  return (
    <ButtonContainer>
      <DownloadButtonElement
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        {children || "Download All"}
      </DownloadButtonElement>
    </ButtonContainer>
  );
};