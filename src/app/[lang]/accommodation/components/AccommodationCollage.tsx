"use client";

import React, { useEffect, useState } from "react";
import "swiper/css";
import { getDestinations } from "@/app/[lang]/accommodation/services/accommodationService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDictionary } from "@context";
import Image from "next/image";
interface Destination {
  code: string;
  name: string;
  image: string | null;
}

export default function AccommodationCollage() {
  const { dict } = useDictionary();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();

  useEffect(() => {
    const fetchDest = async () => {
      try {
        const data = await getDestinations();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(dict.CLIENT.COLLAGE.ERROR_FETCH);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDest();
  }, [dict]);

  const layoutClasses = [
    "col-span-2 sm:col-span-5 md:col-span-6 row-span-2",
    "col-span-1 sm:col-span-4 md:col-span-6 row-span-1",
    "col-span-1 sm:col-span-5 md:col-span-3 row-span-1",
    "col-span-1 sm:col-span-4 md:col-span-3 row-span-1",
    "col-span-1 sm:col-span-5 md:col-span-12 row-span-1",
    "col-span-2 sm:col-span-9 md:col-span-6 row-span-2",
  ];

  if (!dict || Object.keys(dict).length === 0) return null;

  if (loading) {
    return <p className="text-center text-white mt-6">{dict.CLIENT.COLLAGE.LOADING}</p>;
  }

  return (
    <section className="mt-2 px-4 max-w-7xl mx-auto">
      <div className="mx-auto mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-glacier-50">{dict.ACCOMMODATION?.FEATURED_PLACES || "Lugares Destacados"}</h2>
        <p className="text-lg text-glacier-200 mb-8">{dict.ACCOMMODATION?.FEATURED_SUBTITLE || "Experiencias únicas en destinos extraordinarios"}</p>
      </div>

      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-9 md:grid-cols-12 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[250px]">
        {destinations.slice(0, 5).map((dest, idx) => (
          <Link
            href={`/${lang}/accommodation/${dest.code}`}
            key={dest.code || `unknown-${idx}`}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-md group ${layoutClasses[idx % layoutClasses.length]}`}>
            <Image
              width={600}
              height={400}
              src={dest.image || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={dest.name || dict.CLIENT.COLLAGE.ITEM.FALLBACK_NAME}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="w-full p-3 sm:p-4 text-white">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold">{dest.name || dict.CLIENT.COLLAGE.ITEM.FALLBACK_NAME}</h3>
                <div className="mt-1 text-xs sm:text-sm text-gray-200 hidden sm:block">{dict.CLIENT.COLLAGE.ITEM.DISCOVER}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
