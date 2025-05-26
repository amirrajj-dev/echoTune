// stores/music.store.ts
import { create } from "zustand";
import type { ISong, IAlbum } from "../interfaces/interfaces";

interface MusicStore {
  currentSong: ISong | null;
  currentAlbum: IAlbum | null;
  isPlaying: boolean;
  setCurrentSong: (song: ISong) => void;
}

export const useMusic = create<MusicStore>((set) => ({
  currentSong: null,
  currentAlbum: null,
  isPlaying: false,
  setCurrentSong(song) {
    set({ currentSong: song, isPlaying: true });
  },
}));