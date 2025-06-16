export interface User {
  userCode: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  img: string;
  validation: boolean;
  rol: string;
  birthDate: string;
  gender: string;
  nif: string;
  createdAt: string;
}

export interface ProfileStats {
  totalBookings: number;
  totalFlights: number;
  totalFavorites: number;
  totalReviews: number;
  memberSince: string;
}

export interface Booking {
  id: string;
  accommodationName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  totalPrice: number;
  canReview: boolean;
}

export interface Flight {
  id: string;
  flightCode: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  totalPrice: number;
  canReview: boolean;
}

export interface Favorite {
  // Campos básicos
  accommodationCode: string;
  accommodationName: string;
  type: 'hotel' | 'apartment';
  stars: number;
  description: string;
  
  // Ubicación
  location: string;
  cityName?: string;
  countryName?: string;
  continent?: string;
  address?: string;
  postalCode?: string;
  
  // Precios
  price: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  priceDisplay?: string;
  
  // Calificaciones
  rating: number;
  averageRating?: number;
  totalReviews?: number;
  
  // Imágenes
  image: string;
  mainImage?: string;
  images?: string[];
  
  // Información adicional
  amenities?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Estado
  isAvailable?: boolean;
  totalRooms?: number;
  addedDate?: string;
  
  // Para mostrar en la UI
  locationDisplay?: string;
  featuresDisplay?: string;
  
  // Enlaces
  viewUrl?: string;
  bookUrl?: string;
}

export interface Review {
  id: string;
  type: 'accommodation' | 'airline';
  targetName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UpdateProfileData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  nif: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateReviewData {
  type: 'accommodation' | 'airline';
  targetCode: string;
  rating: number;
  comment: string;
}