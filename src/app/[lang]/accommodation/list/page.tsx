import { useLocation } from "react-router-dom";
import AccommodationSearchBar from "./components/AccommodationSearchBar";

export default Results() {
    const location = useLocation();
    const filters = location.state;

    return (
        <div>
            <AccommodationSearchBar onSearch={(newFilters) => console.log(newFilters)} />
            <h2 className="text-xl font-semibold my-4">
                Resultados para {filters?.destination || "..." }
            </h2>
            {/* Aquí renderizas los alojamientos filtrados */}
        </div>
    );
}
