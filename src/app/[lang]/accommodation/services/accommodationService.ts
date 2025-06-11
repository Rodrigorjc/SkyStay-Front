import axiosClient from "@/lib/axiosClient";
import { Accommodation } from "../types/Accommodation";
import { Destination } from "../types/Destination";
import Cookies from "js-cookie";

export async function fetchAccommodations(params: Record<string, string>): Promise<Accommodation[]> {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosClient.get(`/accommodations?${queryString}`);

        const data = response.data;
        const objects = Array.isArray(data.response?.objects) ? data.response.objects : [];

        // Obtener los alojamientos
        const accommodations = objects.map((obj: any) => {
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
                isFavorite: false
            };
        });
        const accommodationsWithFavorites = await Promise.all(
            accommodations.map(async (accommodation: { code: any; type: string; }) => {
                try {
                    // Verificar si hay token en las cookies
                    const token = Cookies.get('token');

                    // Si no hay token, retornar el alojamiento sin verificar favoritos
                    if (!token) {
                        return { ...accommodation, isFavorite: false };
                    }

                    // Asegurarnos que tenemos valores válidos para code y type
                    const code = accommodation.code;
                    const type = accommodation.type || "HOTEL"; // Proporciona un valor por defecto si no existe

                    if (code) {
                        // Solo verificamos si tenemos al menos el código
                        const { isFavorite } = await checkIsFavorite(code, type);
                        return { ...accommodation, isFavorite };
                    }
                    return { ...accommodation, isFavorite: false };
                } catch (error) {
                    console.error(`Error al verificar favorito:`, error);
                    return { ...accommodation, isFavorite: false };
                }
            })
        );
        return accommodationsWithFavorites;
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

        const response = await axiosClient.get(url);
        const accommodationData = response.data;

        const token = Cookies.get('token');

        let isFavoriteStatus = false;

        if (token && code) {
            try {
                const accommodationType = accommodationData.accommodationType || typeAccomodation;
                const favoriteResponse = await checkIsFavorite(code, accommodationType);
                console.log("Respuesta de favorito:", favoriteResponse);
                isFavoriteStatus = favoriteResponse.isFavorite === true;
            } catch (error) {
                console.error("Error al verificar favorito:", error);
                isFavoriteStatus = false;
            }
        }

        return {
            response: {
                objects: {
                    ...accommodationData.response.objects,
                    isFavorite: isFavoriteStatus
                }
            }
        };
    } catch (error) {
        console.error("Error al obtener los detalles del alojamiento:", error);
        throw new Error("Error al obtener los detalles del alojamiento");
    }
}

export async function getMostRatedDestinations() {
    try {
        const response = await axiosClient.get('/accommodations/destinations/most-rated');
        return response.data;
    } catch (error) {
        console.error("Error al obtener destinos mejor calificados:", error);
        return [];
    }
}


export const toggleFavoriteAccommodation = async (accommodationId: string, type: string, isFavorite: boolean) => {
    try {
        const endpoint = isFavorite ? '/accommodations/favorites/remove' : '/accommodations/favorites/add';

        // Añadir type al payload según la estructura esperada por el backend
        const response = await axiosClient.post(endpoint, {
            accommodationId,
            type
        });

        return response.data;
    } catch (error) {
        console.error('Error en favorito:', error);
        throw error;
    }
};

export const checkIsFavorite = async (accommodationCode: string, type: string) => {
    try {
        // Garantiza que type tenga un valor
        const accommodationType = type || "HOTEL";

        const response = await axiosClient.get(
            `/accommodations/favorites/check?code=${encodeURIComponent(accommodationCode)}&type=${encodeURIComponent(accommodationType)}`
        );

        // Verifica si la respuesta contiene datos
        if (!response.data) {
            return { isFavorite: false };
        }

        // La respuesta del backend tiene la propiedad isFavorite
        const isFavorite = response.data.favorite === true;

        return { isFavorite };
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        return { isFavorite: false };
    }
};

export async function getAvailabilityForRooms(
    accommodationCode: string,
    type: string,
    roomIds: string[],
    checkIn?: string,
    checkOut?: string
) {
    try {
        // Construir la URL con los parámetros necesarios
        const params = new URLSearchParams();
        params.append('code', accommodationCode);
        params.append('type', type);

        // Añadir cada ID de habitación como parámetro
        roomIds.forEach(id => params.append('roomId', id));

        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);

        // Llamada a tu API con axios
        const response = await axiosClient.get(`/accommodations/availability?${params.toString()}`);

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
        throw new Error('Error al obtener disponibilidad');
    }
}