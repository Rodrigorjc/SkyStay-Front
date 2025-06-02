"use client";
import { useRouter } from "next/navigation";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Button from "../Button";
import { CityImageVO } from "@/types/home/city";

interface CallToActionProps {
  destinations: CityImageVO[];
}

const CallToAction: React.FC<CallToActionProps> = ({ destinations }) => {
  const router = useRouter();
  const lang = useLanguage();
  const { dict } = useDictionary();

  return (
    <section className="w-full py-8 px-4 text-white">
      <div className="mx-auto mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">{dict.HOME.CALL_TO_ACTION.TITLE}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">{dict.HOME.CALL_TO_ACTION.SUBTITLE}</p>
          <Button
            onClick={() => router.push(`${lang}/register`)}
            text="Únete gratis"
            className="bg-glacier-500/70 hover:bg-glacier-500 text-white px-6 py-3 rounded-full border border-white/10 shadow-lg"
          />
          <h2 className="text-lg md:text-xl text-left mx-auto my-8">{dict.HOME.CALL_TO_ACTION.MOST_VISITED_DESTINATIONS} </h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <Swiper
          spaceBetween={8}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="w-full">
          {destinations.map((place, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] group overflow-hidden rounded-3xl">
                <Image src={place.url} alt={place.name} fill className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 rounded-3xl" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-semibold text-white drop-shadow-md">{place.name}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CallToAction;
