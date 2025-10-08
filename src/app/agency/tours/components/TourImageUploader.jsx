"use client";

import { useState } from "react";
import { GripVertical, Upload, X } from "lucide-react";
import { fetchData } from "@/services/api";
import endpoints from "@/lib/endpoints";

export default function TourImageUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  async function handleImageUpload(files) {
    if (!files?.length) return;
    setUploading(true);

    const res = await fetchData(endpoints.images_signature(), {
      method: "POST",
    });
    const { signature, timestamp, apiKey, cloudName, folder } = await res;

    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadRes.json();
      uploaded.push({
        public_id: data.public_id,
        secure_url: data.secure_url,
      });
    }

    const allImages = [...images, ...uploaded];
    setImages(allImages);
    setUploading(false);
    onUploadComplete(allImages);
  }

  async function removeImage(public_id) {
    try {
      await fetchData(endpoints.images_delete(), {
        method: "POST",
        body: JSON.stringify({ public_id })
      });
      console.log(`Deleted image with publicId: ${public_id}`);

      const updatedImages = images.filter((img) => img.public_id !== public_id);
      setImages(updatedImages);

      onUploadComplete(updatedImages);
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subir Imágenes
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleImageUpload(e.dataTransfer.files);
          }}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Arrastra y suelta las imágenes aquí
          </p>
          <p className="text-sm text-gray-500 mb-4">o</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Seleccionar Archivos
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Imágenes Subidas</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, idx) => (
              <div key={image.public_id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    key={idx}
                    src={image.secure_url}
                    alt=""
                    className="rounded-lg object-cover h-32 w-full"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeImage(image.public_id)}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1 bg-black bg-opacity-50 text-white rounded cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {uploading && <p className="text-sm text-blue-500 mt-2">Subiendo...</p>}
    </div>
  );
}
