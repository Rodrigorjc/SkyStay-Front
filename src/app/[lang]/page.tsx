"use client";

import { useDictionary } from "@context";
import Navbar from "../components/ui/Navbar";
import FAQ from "../components/ui/home/FAQ";
import SearchBarHome from "../components/ui/home/Search";
import BenefitsSection from "../components/ui/home/BenefitsSection";
import CallToAction from "../components/ui/home/CallToAction";
import { useEffect, useState } from "react";
import { getLast5Flights } from "./services/home.service";
import { CityImageVO } from "@/types/home/city";
import Footer from "../components/ui/Footer";

export default function Home() {
  const { dict } = useDictionary();

  const [cities, setCities] = useState<CityImageVO[]>([]);

  useEffect(() => {
    async function fetchCities() {
      const response = await getLast5Flights();
      setCities(response.response.objects);
    }
    fetchCities();
  }, []);

  if (!dict) return null;

  return (
    <div>
      <Navbar />
      <div className="w-full max-w-[1500px] mx-auto px-4 my-10 max-2xl:px-10">
        <CallToAction destinations={cities} />
        <SearchBarHome />
        <BenefitsSection />
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
