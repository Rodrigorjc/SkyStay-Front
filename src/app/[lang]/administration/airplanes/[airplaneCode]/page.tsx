"use client";

import { useParams } from "next/navigation";
import { useDictionary, useLanguage } from "@/app/context/DictionaryContext";
import { use, useState, useEffect } from "react";
import { AirplaneAllCodeVO, Cabin } from "./types/airplane.info";
import Loader from "@/app/components/ui/Loader";
import { getBasicInfoByCode, getCabinsWithSeatsByAirplaneCode } from "./services/airplane.info.service";
import React from "react";
import InfoCard from "./components/InfoCard";
import AirplaneCabins from "./components/AirplaneCabins";
import { Title } from "../../components/Title";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";

export default function airplaneCodePage({ params }: { params: Promise<{ airplaneCode: string }> }) {
  const { dict } = useDictionary();
  const lang = useLanguage();
  const { airplaneCode } = React.use(params);

  const [airplaneInfo, setAirplaneBasicInfo] = useState<AirplaneAllCodeVO>();
  const [cabinDetails, setCabinDetails] = useState<Cabin[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBasicInfoByCode(airplaneCode);
        setAirplaneBasicInfo(data);
        const cabinData = await getCabinsWithSeatsByAirplaneCode(airplaneCode);
        setCabinDetails(cabinData);
        console.log("Basic Info:", cabinData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen ">
          <Loader />
        </div>
      ) : (
        <div className="max-md:p-0 p-6 space-y-6 text-zinc-100">
          <div className="flex items-center justify-start flex-row gap-4">
            <Link href={`/${lang}/administration/airplanes`} className="text-glacier-500 hover:text-glacier-400 transition-colors flex items-center">
              <IoIosArrowRoundBack className="text-4xl text-glacier-500" />
            </Link>
            <Title title={dict.ADMINISTRATION.AIRPLANES.DETAILS_TITLE} />
          </div>
          {airplaneInfo && <InfoCard airplaneInfo={airplaneInfo} />}

          <Title title={dict.ADMINISTRATION.AIRPLANES.CABINS} />

          {!loading && cabinDetails.length > 0 && <AirplaneCabins cabins={cabinDetails} />}
        </div>
      )}
    </>
  );
}
