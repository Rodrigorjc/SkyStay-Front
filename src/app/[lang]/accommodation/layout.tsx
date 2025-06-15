"use client";
import Footer from "@/app/components/ui/Footer";
import Navigation from "@/app/components/ui/Navigation";
import Navbar from "@components/Navbar";
import { useDictionary } from "@context";


export default function AccommodationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { dict } = useDictionary();
    
    if (!dict) return null;

    return (
        <>
            <Navbar></Navbar>
            <Navigation></Navigation>
            {children}
            <Footer />
        </>
    );
}