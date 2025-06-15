import axiosClient from "@/lib/axiosClient";
import { Review, ReviewsResponse, PagedResponse, ReviewSummary } from "@/app/[lang]/accommodation/types/Review";
import Cookies from "js-cookie";

export const getAccommodationReviews = async (
  accommodationCode: string,
  accommodationType: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful' = 'newest'
): Promise<ReviewsResponse> => {
  try {
    const response = await axiosClient.get<PagedResponse<Review>>(`/reviews/${accommodationType}/${accommodationCode}`, {
      params: { page, limit: limit, sortBy }
    });

    const pagedData = response.data;
    
    // Calcular el summary basado en las reseñas recibidas
    const summary = calculateReviewSummary(pagedData.content);

    return {
      reviews: pagedData.content,
      summary,
      pagination: {
        page: pagedData.page,
        limit: pagedData.size,
        total: pagedData.totalElements,
        totalPages: pagedData.totalPages
      }
    };
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    throw new Error(error.response?.data?.message || "Error fetching reviews");
  }
};

// Función auxiliar para calcular el summary
const calculateReviewSummary = (reviews: Review[]): ReviewSummary => {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: {
        10: 0, 9: 0, 8: 0, 7: 0, 6: 0,
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
      }
    };
  }

  const ratingDistribution = {
    10: 0, 9: 0, 8: 0, 7: 0, 6: 0,
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  };

  let totalRating = 0;
  let cleanlinessTotal = 0;
  let comfortTotal = 0;
  let locationTotal = 0;
  let serviceTotal = 0;
  let valueTotal = 0;
  let detailedCount = 0;

  reviews.forEach(review => {
    totalRating += review.rating;
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++;

    if (review.detailedRatings) {
      cleanlinessTotal += review.detailedRatings.cleanliness;
      comfortTotal += review.detailedRatings.comfort;
      locationTotal += review.detailedRatings.location;
      serviceTotal += review.detailedRatings.service;
      valueTotal += review.detailedRatings.value;
      detailedCount++;
    }
  });

  const summary: ReviewSummary = {
    totalReviews: reviews.length,
    averageRating: totalRating / reviews.length,
    ratingDistribution
  };

  if (detailedCount > 0) {
    summary.detailedAverages = {
      cleanliness: cleanlinessTotal / detailedCount,
      comfort: comfortTotal / detailedCount,
      location: locationTotal / detailedCount,
      service: serviceTotal / detailedCount,
      value: valueTotal / detailedCount
    };
  }

  return summary;
};

export const markReviewHelpful = async (reviewId: string, accommodationType?: string) => {
  try {
    const token = Cookies.get("token");
    
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }

    // Crear el payload con el tipo de alojamiento
    const payload: any = {
      reviewId
    };

    // Agregar el tipo de alojamiento si está disponible
    if (accommodationType) {
      payload.accommodationType = accommodationType;
    }

    const response = await axiosClient.post("/reviews/helpful", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error marking review as helpful:", error);
    throw new Error(
      error.response?.data?.message || 
      "Error al marcar la reseña como útil"
    );
  }
};

export const submitReview = async (reviewData: {
  accommodationCode: string;
  accommodationType: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  detailedRatings?: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
  };
}): Promise<Review> => {
  try {
    const response = await axiosClient.post('/reviews', reviewData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error submitting review");
  }
};