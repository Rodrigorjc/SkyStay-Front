import axiosClient from "@/lib/axiosClient";
import { Accommodation } from "../types/Accommodation";
import { Destination } from "../types/Destination";

export async function fetchAccommodations(params: Record<string, string>): Promise<Accommodation[]> {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosClient.get(`/accommodations?${queryString}`);

        const data = response.data;

        const objects = Array.isArray(data.response?.objects) ? data.response.objects : [];
        console.log(objects);
        return objects.map((obj: any) => {
            let lowestPrice = 0;
            if (Array.isArray(obj.availableRooms) && obj.availableRooms.length > 0) {
                lowestPrice = obj.availableRooms.reduce((min: number, room: any) => {
                    return room.price < min || min === 0 ? room.price : min;
                }, 0);
            }

            return {
                code: obj.code,
                name: obj.name,
                location: obj.cityName,
                price: lowestPrice,
                currency: "€",
                rating: obj.stars,
                image: obj.img,
                amenities: obj.amenities,
                description: obj.description,
                type: obj.accommodationType,
                averageRating: obj.averageRating,
            };
        });

    } catch (error) {
        console.error("Error fetching accommodations:", error);
        throw error;
    }
}

export async function fetchCities(): Promise<string[]> {
    try {
        const response = await axiosClient.get(`/accommodations/cities`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
}

export const getDestinations = async (): Promise<Destination[]> => {
    try {
        const response = await axiosClient.get('/accommodations/destinations');

        const data = response.data;

        if (Array.isArray(data)) {
            return data.map((destination: any) => ({
                code: destination.code,
                name: destination.name,
                image: destination.image || "https://www.disfrutamadrid.com/f/espana/madrid/guia/que-ver-m.jpg",
            }));
        } else {
            console.warn("La respuesta del backend no es un array válido.");
            return [];
        }
    } catch (error) {
        console.error("Error al obtener los destinos:", error);
        return [];
    }
};

// Actualización de la función getAccommodationDetails en accommodationService.ts
export async function getAccommodationDetails(
    code: string,
    typeAccomodation: string,
    params?: {
        checkIn?: string,
        checkOut?: string,
        adults?: number,
        children?: number,
        rooms?: number
    }
) {
    try {
        let url = `/accommodations/${code}`;

        if (params) {
            const queryParams = new URLSearchParams();

            // Verifica y convierte los valores antes de añadirlos
            if (params.checkIn) queryParams.append('checkIn', String(params.checkIn));
            if (params.checkOut) queryParams.append('checkOut', String(params.checkOut));
            if (params.adults !== undefined && params.adults !== null) queryParams.append('adults', String(params.adults));
            if (params.children !== undefined && params.children !== null) queryParams.append('children', String(params.children));
            if (params.rooms !== undefined && params.rooms !== null) queryParams.append('rooms', String(params.rooms));

            if (typeAccomodation) {
                queryParams.append('typeAccomodation', typeAccomodation);
            }
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        console.log(url);
        const response = await axiosClient.get(url);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los detalles del alojamiento:", error);
        throw new Error("Error al obtener los detalles del alojamiento");
    }
}