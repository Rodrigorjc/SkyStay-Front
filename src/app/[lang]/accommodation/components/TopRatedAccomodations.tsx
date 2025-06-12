"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { getMostRatedDestinations } from '@/app/[lang]/accommodation/services/accommodationService';
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useDictionary } from "@context";

interface DestinationVO {
    code: string;
    name: string;
    image: string;
}

export default function TopRatedAccommodations() {
    const { dict } = useDictionary();
    const [destinations, setDestinations] = useState<DestinationVO[]>([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef<any>(null);
    const { lang } = useParams();

    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                const data = await getMostRatedDestinations();
                setDestinations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(dict.CLIENT.TOP_RATED.ERROR_FETCH);
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTopRated();
    }, [dict]);

    const stopAutoplay = () => {
        swiperRef.current?.autoplay?.stop();
    };
    const startAutoplay = () => {
        swiperRef.current?.autoplay?.start();
    };

    if (!dict || Object.keys(dict).length === 0) return null;

    if (loading) {
        return (
            <p className="text-center text-white mt-6">
                {dict.CLIENT.TOP_RATED.LOADING}
            </p>
        );
    }

    return (
        <div className="mt-10 px-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
                {dict.CLIENT.TOP_RATED.SECTION_TITLE}
            </h2>

            {destinations.length > 0 ? (
                <div onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
                    <Swiper
                        modules={[Autoplay]}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        autoplay={{ delay: 2000, disableOnInteraction: false }}
                        loop
                        spaceBetween={20}
                        slidesPerView={3}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="max-w-7xl mx-auto"
                    >
                        {destinations.map((dest, idx) => (
                            <SwiperSlide key={`toprated-${dest.code}-${idx}`}>
                                <Link href={`/${lang}/accommodation/${dest.code}`}>
                                    <div className="relative rounded-xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-105">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-72 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                                            <h3 className="text-lg font-semibold text-white">
                                                {dest.name}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <p className="text-center text-white">
                    {dict.CLIENT.TOP_RATED.NO_DATA}
                </p>
            )}
        </div>
    );
}
