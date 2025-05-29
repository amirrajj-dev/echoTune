import { create } from "zustand";
import type { ISong, IAlbum } from "../interfaces/interfaces";

interface MusicStore {
  currentSong: ISong | null;
  currentAlbum: IAlbum | null;
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  isRepeat: boolean;
  isRepeatLoop: boolean;
  isShuffle: boolean;
  volume: number;
  isShowMusicPlayer : boolean

  setCurrentSong: (song: ISong, virtualAlbum?: IAlbum) => void;
  setCurrentAlbum: (album: IAlbum) => void;
  playSong: () => void;
  pauseSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleRepeatLoop: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  seekForward: () => void;
  seekBackward: () => void;
  setIsShowMusicPlayer : (value : boolean)=>void
}

export const useMusic = create<MusicStore>((set, get) => ({
  currentSong: null,
  currentAlbum: null,
  audio: null,
  isPlaying: false,
  isRepeat: localStorage.getItem("repeat") === "true",
  isRepeatLoop: localStorage.getItem("repeatLoop") === "true",
  isShuffle: localStorage.getItem("shuffle") === "true",
  volume: parseFloat(localStorage.getItem("volume") ?? "1"),
  isShowMusicPlayer : false,

  setCurrentSong(song, virtualAlbum) {
    const { audio, pauseSong, volume, isRepeat } = get();

    if (audio) {
      pauseSong();
      audio.src = "";
      audio.onended = null;
    }

    const newAudio = new Audio(song.audioUrl);
    newAudio.volume = volume;
    newAudio.loop = isRepeat;

    newAudio.onended = () => {
      get().nextSong();
    };

    newAudio.play().catch((error) => {
      console.error("Playback failed:", error);
      set({ isPlaying: false });
    });

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
      audio.play().catch(() => set({ isPlaying: false }));
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
    const {
      currentSong,
      currentAlbum,
      setCurrentSong,
      pauseSong,
      isShuffle,
      isRepeatLoop,
    } = get();
    if (!currentAlbum || !currentSong) {
      pauseSong();
      return;
    }

    const songs = currentAlbum.songs;
    const currentIndex = songs.findIndex((s) => s._id === currentSong._id);

    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex && songs.length > 1);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex < songs.length) {
      setCurrentSong(songs[nextIndex]);
    } else if (isRepeatLoop) {
      setCurrentSong(songs[0]);
    } else {
      pauseSong();
      set({ currentSong: null, isPlaying: false });
    }
  },

  previousSong() {
    const { currentSong, currentAlbum, setCurrentSong, pauseSong , isRepeatLoop } = get();
    if (!currentAlbum || !currentSong) {
      pauseSong();
      return;
    }

    const songs = currentAlbum.songs;
    const currentIndex = songs.findIndex((s) => s._id === currentSong._id);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      setCurrentSong(songs[previousIndex]);
    } else {
      if (isRepeatLoop){
        setCurrentSong(songs[songs.length - 1]);
      }else{
        pauseSong();
        set({ currentSong: null, isPlaying: false });
      }
    }
  },

  toggleShuffle() {
    const current = get().isShuffle;
    localStorage.setItem("shuffle", String(!current));
    set({ isShuffle: !current });
  },

  toggleRepeat() {
    const current = get().isRepeat;
    localStorage.setItem("repeat", String(!current));
    const audio = get().audio;
    if (audio) audio.loop = !current;
    set({ isRepeat: !current });
  },

  toggleRepeatLoop() {
    const current = get().isRepeatLoop;
    localStorage.setItem("repeatLoop", String(!current));
    set({ isRepeatLoop: !current });
  },

  setVolume(volume: number) {
    localStorage.setItem("volume", volume.toString());
    const audio = get().audio;
    if (audio) audio.volume = volume;
    set({ volume });
  },

  seekTo(time: number) {
    const audio = get().audio;
    if (audio) audio.currentTime = time;
  },
  seekForward() {
    const audio = get().audio;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  },

  seekBackward() {
    const audio = get().audio;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  },
  setIsShowMusicPlayer(value) {
    set({isShowMusicPlayer : value})
  },
}));
