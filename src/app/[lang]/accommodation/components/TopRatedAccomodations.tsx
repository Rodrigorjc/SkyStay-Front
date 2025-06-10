"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { getMostRatedDestinations } from '@/app/[lang]/accommodation/services/accommodationService';
import Link from "next/link";
import { useParams } from 'next/navigation';

interface DestinationVO {
    code: string;
    name: string;
    image: string;
}

const TopRatedAccommodations: React.FC = () => {
    const [destinations, setDestinations] = useState<DestinationVO[]>([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef<any>(null);
    const { lang } = useParams();

    useEffect(() => {
        const fetchTopRatedDestinations = async () => {
            try {
                const data = await getMostRatedDestinations();
                if (Array.isArray(data)) {
                    setDestinations(data);
                } else {
                    setDestinations([]);
                }
            } catch (error) {
                console.error("Error al obtener destinos:", error);
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedDestinations();
    }, []);

    const handleMouseEnter = () => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
        }
    };

    const handleMouseLeave = () => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
        }
    };

    if (loading) return <p className="text-center text-white mt-6">Cargando alojamientos...</p>;

    return (
        <div className="mt-10 px-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Alojamientos Mejor Calificados
            </h2>

            {destinations.length > 0 ? (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Swiper
                        modules={[Autoplay]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
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
                        {destinations.map((destination, index) => (
                            <SwiperSlide key={`toprated-swiper-${destination.code}-${index}`}>
                                <Link href={`/${lang}/accommodation/${destination.code}`}>
                                    <div className="relative rounded-xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-105">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-72 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
                                            <h3 className="text-lg font-semibold text-white">{destination.name}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <p className="text-center text-white">No hay alojamientos disponibles actualmente</p>
            )}
        </div>
    );
};

export default TopRatedAccommodations;