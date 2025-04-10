"use client";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const UploadImage = () => {
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
            setImageUrls(prev => [...prev, result.info.secure_url]);
            console.log("Imagen subida:", result.info.secure_url);
          }
        }
      );
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => widgetRef.current && widgetRef.current.open()}
        className="px-6 py-3 rounded-full font-semibold transition-all duration-400 hover:scale-105 active:scale-95 bg-glacier-200 text-black active:bg-glacier-300">
        Subir imágenes
      </button>
    </div>
  );
};

export default UploadImage;
