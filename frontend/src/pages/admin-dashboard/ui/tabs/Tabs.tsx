import { DiscAlbum, Music, Music2, Plus } from "lucide-react";
import SongsTable from "./tables/SongsTable";
import AlbumsTable from "./tables/AlbumsTable";
import SongsModal from "../modals/SongsModal";
import { useModals } from "../../../../store/modal.store";
import AlbumsModal from "../modals/AlbumsModal";

const Tabs = () => {
  const { setIsSongsModalOpen, setIsAlbumsModalOpen } = useModals();
  return (
    <>
      <div className="tabs tabs-lift">
        <label className="tab">
          <input type="radio" name="my_tabs_4" />
          <Music size={20} className="mr-2" />
          Songs
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-base-300 p-4 rounded-md gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <Music2 /> Songs
                </h1>
                <p className="text-sm text-base-content">
                  Manage your songs here
                </p>
              </div>
              <button
                onClick={() => setIsSongsModalOpen(true)}
                className="btn btn-accent w-full sm:w-auto"
              >
                <Plus /> Add Song
              </button>
            </div>
            <SongsTable />
          </div>
        </div>

        <label className="tab">
          <input type="radio" name="my_tabs_4" defaultChecked />
          <DiscAlbum size={20} className="mr-2" />
          Albums
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-base-300 p-4 rounded-md gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <DiscAlbum /> Albums
              </h1>
              <p className="text-sm text-base-content">
                Manage your albums here
              </p>
            </div>
            <button
              onClick={() => setIsAlbumsModalOpen(true)}
              className="btn btn-accent w-full sm:w-auto"
            >
              <Plus /> Add Album
            </button>
          </div>
          <AlbumsTable />
        </div>
      </div>
      <SongsModal />
      <AlbumsModal />
    </>
  );
};

export default Tabs;
