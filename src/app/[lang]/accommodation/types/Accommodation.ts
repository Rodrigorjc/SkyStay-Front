export interface Accommodation {
    code: string;
    name: string;
    location: string;
    price: number;
    currency: string;
    rating: number;
    image: string;
    amenities: string[];
    description: string;
    type: string;
    averageRating?: number;
    isFavorite?: boolean;
}