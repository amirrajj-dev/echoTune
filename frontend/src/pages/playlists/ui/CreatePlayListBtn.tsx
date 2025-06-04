import { Plus } from "lucide-react";

interface CreatePlaylistButtonProps {
  setIsModalOpen: (value: boolean) => void;
}

const CreatePlaylistBtn = ({ setIsModalOpen }: CreatePlaylistButtonProps) => {
  return (
    <div className="mb-6 p-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
      <button
        className="btn btn-primary gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-5 h-5" /> Create Playlist
      </button>
    </div>
  );
};

export default CreatePlaylistBtn;