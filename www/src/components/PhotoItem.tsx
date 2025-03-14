import { styled } from "styled-components";
import { Photo } from "../types";

const Container = styled.div`
  position: relative;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.3);
  }
`;

interface PhotoItemProps {
  photo: Photo;
  onDelete: (id: number) => void;
}

const PhotoItem = ({ photo, onDelete }: PhotoItemProps) => {
  return (
    <Container>
      <img src={photo.url} alt="uploaded preview" />
      <DeleteButton 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(photo.id);
        }}
        type="button"
      >
        ✕
      </DeleteButton>
    </Container>
  );
};

export default PhotoItem;