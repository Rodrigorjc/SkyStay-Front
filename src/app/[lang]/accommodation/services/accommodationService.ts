import axiosClient from "@/lib/axiosClient";
import { Accommodation } from "../types/Accommodation";

export async function fetchAccommodations(params: Record<string, string>): Promise<Accommodation[]> {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await axiosClient.get(`/accommodations?${queryString}`);

        const data = response.data;

        // Validar que data.response.objects sea un array
        const objects = Array.isArray(data.response?.objects) ? data.response.objects : [];

        // Mapear los datos del backend al tipo Accommodation
        return objects.map((obj: any) => ({
            id: obj.hotelId.toString(),
            name: obj.hotelName,
            location: obj.cityName,
            price: obj.availableRooms[0]?.availableCount || 0, // Usar el primer tipo de habitación como referencia
            currency: "EUR", // Ajusta según sea necesario
            rating: obj.stars,
            images: ["/placeholder.jpg"], // Ajusta si hay imágenes en la respuesta
            amenities: [], // Ajusta si hay amenities en la respuesta
            description: obj.description,
        }));
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