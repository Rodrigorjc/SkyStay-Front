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
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload, buttonClassName, onWidgetOpen, onWidgetClose }) => {
  const { dict } = useDictionary();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const widgetRef = useRef<any>(null);

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
  }, [imageUrls, onUpload]);

  return (
    <div>
      <button
        onClick={() => {
          onWidgetOpen?.();
          widgetRef.current && widgetRef.current.open();
        }}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-400 hover:scale-105 active:scale-95 bg-glacier-300 text-black active:bg-glacier-950 ${buttonClassName}`}>
        {dict.UPLOAD_IMAGE}
      </button>
    </div>
  );
};

export default UploadImage;
