import { styled } from "styled-components";
import { FormEvent, ReactNode } from "react";

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

interface SubmitButtonProps {
  photoCount: number;
  onSubmit: (e: FormEvent) => void;
  disabled?: boolean;
  children?: ReactNode; // Add support for children
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