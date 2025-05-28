import { create } from "zustand";
import type { ISong, IAlbum } from "../interfaces/interfaces";

interface MusicStore {
  currentSong: ISong | null;
  currentAlbum: IAlbum | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;

  setCurrentSong: (song: ISong, virtualAlbum?: IAlbum) => void;
  setCurrentAlbum: (album: IAlbum) => void;
  playSong: () => void;
  pauseSong: () => void;
  nextSong: () => void;
}

export const useMusic = create<MusicStore>((set, get) => ({
  currentSong: null,
  currentAlbum: null,
  isPlaying: false,
  audio: null,

  setCurrentSong(song, virtualAlbum) {
    const { audio, pauseSong } = get();

    // Pause and clean up existing audio
    if (audio) {
      pauseSong();
      audio.src = "";
      audio.onended = null;
    }

    // Create new audio instance
    const newAudio = new Audio(song.audioUrl);
    newAudio.onended = () => {
      get().nextSong();
    };

    // Play the new song
    newAudio.play().catch((error) => {
      console.error("Error playing audio:", error);
      set({ isPlaying: false });
    });

    // Set the virtual album if provided, otherwise keep currentAlbum
    set({
      currentSong: song,
      currentAlbum: virtualAlbum ?? get().currentAlbum,
      isPlaying: true,
      audio: newAudio,
    });
  },

  setCurrentAlbum(album) {
    set({ currentAlbum: album });
  },

  playSong() {
    const { audio } = get();
    if (audio) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        set({ isPlaying: false });
      });
      set({ isPlaying: true });
    }
  },

  pauseSong() {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
    }
  },

  nextSong() {
    const { currentSong, currentAlbum, setCurrentSong, pauseSong } = get();
    if (!currentAlbum || !currentSong) {
      pauseSong();
      return;
    }

    const songs = currentAlbum.songs;
    const currentIndex = songs.findIndex((s) => s._id === currentSong._id);
    const nextSong = songs[currentIndex + 1];

    if (nextSong) {
      setCurrentSong(nextSong);
    } else {
      pauseSong();
      set({ currentSong: null, isPlaying: false });
    }
  },
}));
