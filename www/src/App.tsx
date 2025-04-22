import { styled } from "styled-components";
import PhotoUploader from "./components/PhotoUploader";
import PhotoList from "./components/PhotoList";
import BannerText from "./components/BannerText";

const Container = styled.div`
  padding: 2rem;
`;

function App() {
  return (
    <Container className="max-w-full max-h-full">
      <Container>
        <BannerText />
        <PhotoUploader />
        <PhotoList />
      </Container>
    </Container>
  );
}

export default App;
