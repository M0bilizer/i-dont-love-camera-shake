import { styled } from "styled-components";
import PhotoUploader from "./components/PhotoUploader";
import FileList from "./components/FileList";

const Container = styled.div`
  padding: 2rem;
`;

function App() {
  return (
    <Container className="max-w-full max-h-full">
      <Container>
        <PhotoUploader/>
        <FileList/>
      </Container>
    </Container>
  );
}

export default App;
