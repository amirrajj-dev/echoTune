import MusicPlayer from "../../components/shared/musicPlayer/MusicPlayer";
import FeaturedSongs from "./ui/FeaturedSongs";
import MadeForYouSongs from "./ui/MadeForYouSongs";
import TrendingSongs from "./ui/TrendingSongs";


const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <FeaturedSongs/>
      <MadeForYouSongs/>
      <TrendingSongs/>
      <MusicPlayer/>
    </div>
  );
};

export default HomePage;
