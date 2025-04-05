"use client";
import { useDictionary } from "@context";
export default function Home() {
    const { dict } = useDictionary();

    if (!dict) {
        return;
    }

    return (
        <button>
            {dict.HOME.WELCOME}
        </button>
    );
}