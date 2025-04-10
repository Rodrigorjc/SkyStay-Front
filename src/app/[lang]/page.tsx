"use client";

import { useDictionary } from "@context";
import CloudinaryUpload from "../components/upload/UploadImage";

export default function Home({}: { params: { lang: string } }) {
  const { dict } = useDictionary();

  if (!dict) return null;

  return (
    <div className="h-dvh flex flex-col items-center justify-center gap-4">
      <p className="text-3xl font-bold">{dict.HOME.WELCOME}</p>
      <CloudinaryUpload />
    </div>
  );
}
