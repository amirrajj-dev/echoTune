import Logo from "../../../components/ui/Logo";

const PlaylistsHeader = () => {
  return (
    <header className="mb-8 p-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">
      <Logo />
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
        Your Playlists
      </h1>
    </header>
  );
};

export default PlaylistsHeader;