'use client';
import AccommodationSearchBar from "./components/AccommodationSearchBar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Navbar from "@components/Navbar";
import {useDictionary} from "@context";
import AccommodationCollage from "@/app/[lang]/accommodation/components/AccommodationCollage";
import TopRatedAccommodations from "@/app/[lang]/accommodation/components/TopRatedAccomodations";
import Benefits from "@/app/[lang]/accommodation/components/Benefits";


const AccommodationPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";
    const { dict } = useDictionary();
    if (!dict || Object.keys(dict).length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-10">
            <AccommodationSearchBar onSearch={() => {}} />
            <AccommodationCollage></AccommodationCollage>
            <TopRatedAccommodations></TopRatedAccommodations>
            <Benefits></Benefits>
        </div>
    );
};

export default AccommodationPage;