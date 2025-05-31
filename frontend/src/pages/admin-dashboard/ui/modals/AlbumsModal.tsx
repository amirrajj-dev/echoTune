import React, { useEffect, useRef, useState } from "react";
import { useModals } from "../../../../store/modal.store";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../configs/axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CreateAlbumData {
  title: string;
  artist: string;
  releaseYear: number;
  imageFile: File;
}

const AlbumsModal = () => {
  const { isAlbumsModalOpen, setIsAlbumsModalOpen } = useModals();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    releaseYear: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const resetForm = () => {
    setForm({ title: "", artist: "", releaseYear: "" });
    setImageFile(null);
  };

  const handleClose = () => {
    resetForm();
    setIsAlbumsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = isAlbumsModalOpen ? "hidden" : "auto";
  }, [isAlbumsModalOpen]);

  const { mutate: createAlbum, isPending } = useMutation({
    mutationKey: ["createAlbum"],
    mutationFn: async (data: CreateAlbumData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("artist", data.artist);
      formData.append("releaseYear", String(data.releaseYear));
      formData.append("imageFile", data.imageFile);
      const response = await axiosInstance.post("/admin/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Album created successfully");
      handleClose();
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error creating album");
    },
  });

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const handleCreateAlbum = async () => {
    const data = {
      title: form.title,
      artist: form.artist,
      releaseYear: Number(form.releaseYear),
      imageFile,
    };
    if (!data.title.trim() || !data.artist.trim() || !data.releaseYear || !data.imageFile) {
      toast.error("Please fill all the fields");
      return;
    }
    createAlbum(data as CreateAlbumData);
  };

  return (
    <div
      className={`fixed ${isAlbumsModalOpen ? "block" : "hidden"} h-screen inset-0 bg-black/50 z-50 flex items-center justify-center`}
    >
      <div className="bg-base-200 rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-base-content">Add New Album</h3>
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
              {imageFile ? "Replace image" : "Drag & drop or click to upload album cover"}
            </p>
            <p className="text-xs text-base-content mt-1">
              Supports JPG, PNG, up to 5MB
            </p>
          </div>
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Album Title"
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
            placeholder="Release Year"
            value={form.releaseYear}
            onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
            className="input input-accent border-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={handleClose} className="btn btn-accent btn-soft">
            Cancel
          </button>
          <button onClick={handleCreateAlbum} className="btn btn-accent">
            {isPending ? (
              <span className="loading loading-spinner">
                <Loader2 />
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Add Album
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumsModal;