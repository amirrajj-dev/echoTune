import Logo from "../../../components/ui/Logo";

interface PlaylistHeaderProps {
  playlistName: string;
}

const PlaylistHeader = ({ playlistName }: PlaylistHeaderProps) => {
  return (
    <header className="mb-8 p-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Logo />
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content truncate capitalize">
          {playlistName}
        </h1>
      </div>
    </header>
  );
};

export default PlaylistHeader;