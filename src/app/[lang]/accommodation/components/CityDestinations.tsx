"use client";
import { useRouter } from "next/navigation";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import { CityImageVO } from "@/types/home/city";

interface CityDestinationsProps {
  destinations: CityImageVO[];
}

const CityDestinations: React.FC<CityDestinationsProps> = ({ destinations }) => {
  const router = useRouter();
  const lang = useLanguage();
  const { dict } = useDictionary();

  const handleCityClick = (cityName: string) => {
    router.push(`/${lang}/accommodation/list?destination=${encodeURIComponent(cityName)}`);
  };

  return (
    <section className="w-full py-8">
      <div className="mx-auto mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-glacier-50">
          {dict.ACCOMMODATION?.POPULAR_DESTINATIONS || "Destinos Populares"}
        </h2>
        <p className="text-lg text-glacier-200 mb-8">
          {dict.ACCOMMODATION?.EXPLORE_CITIES || "Explora las ciudades más visitadas"}
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ 
            delay: 3000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          modules={[Autoplay]}
          className="w-full"
        >
          {destinations.map((city, idx) => (
            <SwiperSlide key={idx}>
              <div 
                className="relative h-[250px] md:h-[300px] group overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleCityClick(city.name)}
              >
                <Image 
                  src={city.url} 
                  alt={city.name} 
                  fill 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 rounded-2xl" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg">
                    {city.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-full">
                    <span className="text-gray-800 font-medium">
                      {dict.ACCOMMODATION?.EXPLORE || "Explorar"}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CityDestinations;