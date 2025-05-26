"use client";

import { useParams } from "next/navigation";
import { useDictionary } from "@/app/context/DictionaryContext";
import { use, useState, useEffect } from "react";
import { AirplaneAllCodeVO, Cabin } from "./types/airplane.info";
import Loader from "@/app/components/ui/Loader";
import { getBasicInfoByCode, getCabinsWithSeatsByAirplaneCode } from "./services/airplane.info.service";
import React from "react";
import InfoCard from "./components/InfoCard";
import AirplaneCabins from "./components/AirplaneCabins";

export default function airplaneCodePage({ params }: { params: Promise<{ airplaneCode: string }> }) {
  const { dict } = useDictionary();
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
          {airplaneInfo && <InfoCard airplaneInfo={airplaneInfo} />}
          {!loading && cabinDetails.length > 0 && <AirplaneCabins cabins={cabinDetails} />}
        </div>
      )}
    </>
  );
}
