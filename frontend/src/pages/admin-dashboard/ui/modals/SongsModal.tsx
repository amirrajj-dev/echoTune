import React, { useEffect, useRef, useState } from "react";
import { useModals } from "../../../../store/modal.store";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../configs/axios";
import type { IAlbum, ISong } from "../../../../interfaces/interfaces";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CreateSongData
  extends Pick<ISong, "artist" | "title" | "duration" | "albumId"> {
  audioFile: File;
  imageFile: File;
}

const SongsModal = () => {
  const { isSongsModalOpen, setIsSongsModalOpen } = useModals();
  const resetForm = () => {
    setForm({ title: "", artist: "", duration: "", albumId: "" });
    setImageFile(null);
    setAudioFile(null);
  };

  const handleClose = () => {
    resetForm();
    setIsSongsModalOpen(false);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    duration: "",
    albumId: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const albums = queryClient.getQueriesData<IAlbum[]>({ queryKey: ["albums"] });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = isSongsModalOpen ? "hidden" : "auto";
  }, [isSongsModalOpen]);

  const { mutate : createSong, isPending } = useMutation({
    mutationKey: ["createSong"],
    mutationFn: async (data: CreateSongData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("artist", data.artist);
      formData.append("duration", String(data.duration));
      if (data.albumId) {
        formData.append("albumId", data.albumId);
      }
      formData.append("audioFile", data.audioFile);
      formData.append("imageFile", data.imageFile);
      console.log(axiosInstance.defaults.headers["Authorization"]);
      const response = await axiosInstance.post("/admin/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess : ()=>{
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Song created successfully");
      handleClose();
    },
    onError : (e)=>{
        console.log(e);
        toast.error("Error creating song");
    }
  });

  const handleCreateSong = async ()=>{
    const data = {
      title : form.title,
      artist : form.artist,
      duration : Number(form.duration),
      albumId : form.albumId,
      audioFile,
      imageFile
    }
    console.log(data);
    if (!data.title.trim() || !data.artist.trim() || !data.duration || !data.audioFile || !data.imageFile) {
      toast.error("Please fill all the fields");
      return;
    }
    createSong(data as CreateSongData);
  }

  return (
    <div
      className={`fixed ${
        isSongsModalOpen ? "block" : "hidden"
      } h-screen inset-0 bg-black/50 z-50 flex items-center justify-center`}
    >
      <div className="bg-base-200 rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-base-content">Add New Song</h3>
          <button onClick={handleClose} className="btn btn-circle btn-accent">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Upload */}
        <div
          className={`relative border-2 bg-base-300 border-dashed rounded-xl p-6 mb-6 transition-all duration-300 ${
            isDragging ? "border-accent" : "border-base-content"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleImageDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex flex-col items-center justify-center text-center">
            {imageFile ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="rounded-lg h-40 w-full object-cover mb-4"
              />
            ) : (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ImageIcon className="w-12 h-12 text-accent mb-2" />
              </motion.div>
            )}
            <p className="text-sm text-base-content">
              {imageFile
                ? "Replace image"
                : "Drag & drop or click to upload cover image"}
            </p>
            <p className="text-xs text-base-content mt-1">
              Supports JPG, PNG, up to 5MB
            </p>
          </div>
        </div>

        {/* Audio Upload */}
        <label className="flex flex-col gap-2 relative mb-6">
          <span className="text-sm font-medium text-base-content">
            Audio File
          </span>
          <button className="btn btn-accent cursor-pointer">
            Choose Audio File
          </button>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="mt-2  cursor-pointer absolute top-5 opacity-0  block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
          />
          {audioFile && (
            <audio
              src={URL.createObjectURL(audioFile)}
              controls
              className="mt-3 w-full"
            />
          )}
        </label>

        {/* Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Song Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input input-accent border-none"
          />
          <input
            type="text"
            placeholder="Artist Name"
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            className="input input-accent border-none"
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="input input-accent border-none"
          />
          <select
            className="select select-accent border-none"
            value={form.albumId}
            onChange={(e) => setForm({ ...form, albumId: e.target.value })}
          >
            <option value="">Select Album (Optional)</option>
            {albums[0][1]?.map((album) => (
              <option key={album._id} value={album._id}>
                {album.title}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={handleClose} className="btn btn-accent btn-soft">
            Cancel
          </button>
          <button onClick={()=>handleCreateSong()} className="btn btn-accent">
            {isPending ? (
              <span className="loading loading-spinner">
                <Loader2/>
              </span>
            ) : (
                <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add Song
                </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongsModal;
