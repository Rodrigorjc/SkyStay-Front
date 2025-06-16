"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CatchAllNotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = (["en", "es"].includes(pathname.split("/")[1]) ? pathname.split("/")[1] : "en") as "en" | "es";

  useEffect(() => {
    router.replace(`/${lang}/not-found`);
  }, [lang, router]);

  return null;
}
