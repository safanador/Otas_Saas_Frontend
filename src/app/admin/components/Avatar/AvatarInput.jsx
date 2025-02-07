import React from "react";
import { Pencil } from "lucide-react";

const AvatarInput = ({ image, onChange, imageUrl, isEditing=true }) => {
  return (
    <div className="flex items-center justify-center">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-300">
            {image || imageUrl ? (
                <img
                src={imageUrl ? imageUrl  : URL.createObjectURL(image) }
                alt="Profile"
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                </div>
            )}
            {isEditing && (
                <label
                htmlFor="image"
                className="absolute z-50 bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer border border-gray-300"
            >
                <Pencil className="w-4 h-4 text-gray-700" />
                <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                onChange={onChange}
                />
            </label>
            )}
        </div>
    </div>
  );
};

export default AvatarInput;