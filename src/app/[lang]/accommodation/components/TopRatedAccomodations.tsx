import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const TopRatedAccommodations: React.FC = () => {
    const accommodations = [
        {
            code: 1,
            name: 'Hotel Alfonso XIII',
            image: 'https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg',
        },
        {
            code: 2,
            name: 'Apartamento Buenavista',
            image: 'https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg',
        },
        {
            code: 3,
            name: 'Madrid Centro Lujo',
            image: 'https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg',
        },
        {
            code: 4,
            name: 'Loft Sevilla Antiguo',
            image: 'https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg',
        },
        {
            code: 5,
            name: 'Apartamento El Rastro',
            image: 'https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg',
        },
    ];

    let swiperRef: any = null;

    return (
        <div className="mt-10 px-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Alojamientos Mejor Calificados
            </h2>

            <Swiper
                modules={[Autoplay]}
                onSwiper={(swiper) => (swiperRef = swiper)}
                autoplay={{
                    delay: 3500,
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
                onMouseEnter={() => swiperRef?.autoplay.stop()}
                onMouseLeave={() => swiperRef?.autoplay.start()}
            >
                {accommodations.map((accommodation) => (
                    <SwiperSlide key={accommodation.code}>
                        <div className="relative rounded-xl overflow-hidden shadow-lg group transition-transform duration-300 hover:scale-105">
                            <img
                                src={accommodation.image}
                                alt={accommodation.name}
                                className="w-full h-72 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-lg font-semibold text-white">{accommodation.name}</h3>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TopRatedAccommodations;