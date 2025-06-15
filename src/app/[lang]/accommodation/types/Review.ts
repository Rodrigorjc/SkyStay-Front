export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  accommodationCode: string;
  rating: number; // 1-10
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  isVerifiedStay: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  detailedRatings?: {
    cleanliness: number; // 1-10
    comfort: number; // 1-10
    location: number; // 1-10
    service: number; // 1-10
    value: number; // 1-10
  };
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number; // promedio de 1-10
  ratingDistribution: {
    10: number;
    9: number;
    8: number;
    7: number;
    6: number;
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  detailedAverages?: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
  };
}

// Estructura que devuelve el backend
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Respuesta completa que construiremos en el frontend
export interface ReviewsResponse {
  reviews: Review[];
  summary: ReviewSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}