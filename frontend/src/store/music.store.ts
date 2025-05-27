import { create } from "zustand";
import type { ISong, IAlbum } from "../interfaces/interfaces";

interface MusicStore {
  currentSong: ISong | null;
  currentAlbum: IAlbum | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;

  setCurrentSong: (song: ISong) => void;
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

  setCurrentSong(song) {
    const { audio } = get();

    if (audio) {
      audio.pause();
      audio.src = "";
      audio.onended = null;
    }

    const newAudio = new Audio(song.audioUrl);

    newAudio.onended = () => {
      get().nextSong();
    };

    newAudio.play();

    set({
      currentSong: song,
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
      audio.play();
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
    const { currentSong, currentAlbum, setCurrentSong } = get();
    if (!currentAlbum || !currentSong) return;

    const songs = currentAlbum.songs;
    const currentIndex = songs.findIndex((s) => s._id === currentSong._id);
    const next = songs[currentIndex + 1];

    if (next) {
      setCurrentSong(next);
    } else {
      set({ isPlaying: false });
    }
  },
}));