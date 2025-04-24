import PhotoUploader from "./components/PhotoUploader";
import PhotoList from "./components/PhotoList";
import BannerText from "./components/BannerText";

function App() {
  return (
    <div className="sm:p-8 p-0">
      <BannerText />
      <PhotoUploader />
      <PhotoList />
    </div>
  );
}

export default App;
