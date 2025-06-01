'use client';
import AccommodationSearchBar from "./components/AccommodationSearchBar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Navbar from "@components/Navbar";
import {useDictionary} from "@context";
import AccommodationCollage from "@/app/[lang]/accommodation/components/AccommodationCollage";


const AccommodationPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const lang = pathname.split("/")[1] || "en";
    const { dict } = useDictionary();
    if (!dict || Object.keys(dict).length === 0) {
        return null;
    }

    return (
        <div>
            <div className="bg-glacier-300 py-0.5">
                <Navbar dict={dict}></Navbar>
            </div>
            <AccommodationSearchBar onSearch={() => {}} />
            <AccommodationCollage></AccommodationCollage>
        </div>
    );
};

export default AccommodationPage;