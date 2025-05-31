'use client';
import AccommodationSearchBar from "./components/AccommodationSearchBar";
import { useRouter } from "next/navigation";

interface SearchFilters {
    // Define aquí las propiedades de tus filtros, por ejemplo:
    location?: string;
    checkIn?: Date;
    checkOut?: Date;
    guests?: number;
}

const AccommodationPage = () => {
    const router = useRouter();

    const handleSearch = (filters: SearchFilters) => {
        // En Next.js usamos el router para navegar
        // Puedes usar query params para pasar los filtros
        const params = new URLSearchParams();

        // Agrega los filtros a los parámetros de URL
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });

        router.push(`list?${params.toString()}`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Encuentra tu alojamiento ideal</h1>
            <AccommodationSearchBar onSearch={handleSearch} />
        </div>
    );
};

export default AccommodationPage;