"use client";
import Navbar from "@/app/components/ui/Navbar";
import Footer from "@/app/components/ui/Footer";
import React from "react";
import Navigation from "@/app/components/ui/Navigation";

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-t from-glacier-950 via-zinc-900 to-glacier-900 bg-blend-exclusion">
      <Navbar />
      <main>
        <Navigation />
        {children}
      </main>
      <Footer />
    </div>
  );
}
