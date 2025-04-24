import PhotoUploader from "./components/PhotoUploader";
import PhotoList from "./components/PhotoList";
import BannerText from "./components/BannerText";

function App() {
  return (
    <div className="p-0 sm:p-8">
      <BannerText />
      <PhotoUploader />
      <PhotoList />
    </div>
  );
}

export default App;
