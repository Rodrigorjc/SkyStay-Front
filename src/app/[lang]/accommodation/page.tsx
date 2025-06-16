"use client";
import AccommodationSearchBar from "./components/AccommodationSearchBar";

import { useDictionary } from "@context";
import AccommodationCollage from "@/app/[lang]/accommodation/components/AccommodationCollage";
import TopRatedAccommodations from "@/app/[lang]/accommodation/components/TopRatedAccomodations";
import Benefits from "@/app/[lang]/accommodation/components/Benefits";
import CityDestinations from "@/app/[lang]/accommodation/components/CityDestinations";
import TransitionSection from "@/app/[lang]/accommodation/components/TransitionSection";
import { useEffect, useState } from "react";
import { getLast5Flights } from "../services/home.service";
import { CityImageVO } from "@/types/home/city";

const AccommodationPage = () => {
  const { dict } = useDictionary();
  const [cities, setCities] = useState<CityImageVO[]>([]);

  useEffect(() => {
    async function fetchCities() {
      const response = await getLast5Flights();
      setCities(response.response.objects);
    }
    fetchCities();
  }, []);

  if (!dict || Object.keys(dict).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-5">
      <AccommodationSearchBar onSearch={() => {}} />
      <div className="space-y-10">
        <TopRatedAccommodations />
        <Benefits />
        <AccommodationCollage />
        <CityDestinations destinations={cities} />
      </div>
      <TransitionSection />
    </div>
  );
};

export default AccommodationPage;
