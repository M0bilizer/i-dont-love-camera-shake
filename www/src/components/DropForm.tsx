import { styled } from "styled-components";
import { RefObject } from "react";
import { DropFormProps } from "../types";

const Container = styled.div<DropFormProps>`
  text-align: center;
  cursor: pointer;
  padding: ${props => props.hasPhotos ? '0' : '2rem'};
  margin-bottom: ${props => props.hasPhotos ? '0' : '0'};
  min-height: ${props => props.hasPhotos ? '0' : '100px'};
  display: ${props => props.hasPhotos ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
`;

interface DropZoneComponentProps {
  hasPhotos: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>; // Updated this type
  children: React.ReactNode;
}

export const DropForm = ({ hasPhotos, fileInputRef, children }: DropZoneComponentProps) => {
  return (
    <Container
      onClick={() => fileInputRef.current?.click()}
      hasPhotos={hasPhotos}
    >
      {children}
    </Container>
  );
};