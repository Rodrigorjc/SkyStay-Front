"use client";
import { useDictionary } from "@context";
import Navbar from "../components/ui/Navbar";

export default function Home() {
    const { dict } = useDictionary();

    if (!dict) {
        return;
    }

    return (
        <div>
            <Navbar dict={dict}></Navbar>
            <button>
                {dict.HOME.WELCOME}
            </button>
        </div>

    );
}