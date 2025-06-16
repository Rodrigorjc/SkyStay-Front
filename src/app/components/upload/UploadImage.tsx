"use client";
import { useDictionary } from "@/app/context/DictionaryContext";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}
interface UploadImageProps {
  onUpload: (urls: string[]) => void;
  buttonClassName?: string;
  onWidgetOpen?: () => void;
  onWidgetClose?: () => void;
  color?: "default" | "admin";
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload, buttonClassName = "", onWidgetOpen, onWidgetClose, color = "default" }) => {
  const { dict } = useDictionary();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const widgetRef = useRef<any>(null);

  const baseStyles = "px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm";
  const colors: { [key in "default" | "admin"]: string } = {
    default: "bg-glacier-200 text-black hover:bg-glacier-100 active:bg-glacier-300",
    admin: "bg-glacier-700/40 text-white border border-glacier-500 hover:bg-glacier-600/40 active:bg-glacier-800/40",
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "SkyStay",
          multiple: true,
        },
        (error: any, result: any) => {
          if (!error && result.event === "success") {
            const newUrl = result.info.secure_url;
            setImageUrls(prev => [...prev, newUrl]);
            onUpload([...imageUrls, newUrl]);
            console.log("Imagen subida:", newUrl);
          }
          if (result.event === "close") {
            onWidgetClose?.();
          }
        }
      );
    }
  }, [imageUrls, onUpload, onWidgetClose]);

  return (
    <div>
      <button
        onClick={() => {
          onWidgetOpen?.();
          widgetRef.current && widgetRef.current.open();
        }}
        className={`${baseStyles} ${colors[color]} ${buttonClassName}`}>
        {dict.UPLOAD_IMAGE}
      </button>
    </div>
  );
};

export default UploadImage;
