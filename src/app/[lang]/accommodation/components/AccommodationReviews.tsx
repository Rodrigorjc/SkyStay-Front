"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrophy, FaThumbsUp, FaUser, FaCalendarAlt, FaCheckCircle, FaSort, FaInfoCircle, FaUserCircle } from "react-icons/fa";
import { Review, ReviewSummary } from "@/app/[lang]/accommodation/types/Review";
import { getAccommodationReviews, markReviewHelpful } from "../services/reviewService";
import { useDictionary } from "@context";
import Cookies from "js-cookie";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";

interface AccommodationReviewsProps {
  accommodationCode: string;
  accommodationType: string;
  className?: string;
}

export default function AccommodationReviews({
  accommodationCode,
  accommodationType,
  className = ""
}: AccommodationReviewsProps) {
  const { dict } = useDictionary();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState<Notifications>();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
    loadReviews();
  }, [accommodationCode, accommodationType, sortBy]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getAccommodationReviews(
        accommodationCode,
        accommodationType,
        1,
        showAll ? 50 : 6,
        sortBy
      );
      setReviews(data.reviews);
      setSummary(data.summary);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToProfile = () => {
    const currentPath = window.location.pathname;
    const lang = currentPath.split('/')[1] || 'es';
    router.push(`/${lang}/profile`);
  };

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    const lang = currentPath.split('/')[1] || 'es';
    router.push(`/${lang}/login`);
  };

  const handleMarkHelpful = async (reviewId: string) => {
    const token = Cookies.get("token");
    
    if (!token) {
      setNotification({
        titulo: dict.CLIENT.ACCOMMODATION.LOGIN_REQUIRED_TITLE || "Inicio de sesión requerido",
        mensaje: dict.CLIENT.ACCOMMODATION.LOGIN_REQUIRED_MESSAGE || "Debes iniciar sesión para marcar reseñas como útiles",
        code: 401,
        tipo: "warning",
      });
      return;
    }

    try {
      // Pasar el tipo de alojamiento al servicio
      await markReviewHelpful(reviewId, accommodationType);
      setHelpfulReviews(prev => new Set([...prev, reviewId]));
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpfulCount: review.helpfulCount + 1 }
          : review
      ));

      setNotification({
        titulo: dict.CLIENT.ACCOMMODATION.HELPFUL_SUCCESS_TITLE || "¡Gracias!",
        mensaje: dict.CLIENT.ACCOMMODATION.HELPFUL_SUCCESS_MESSAGE || "Has marcado esta reseña como útil",
        code: 200,
        tipo: "success",
      });

    } catch (err: any) {
      console.error("Error marking review as helpful:", err);
      setNotification({
        titulo: dict.CLIENT.ACCOMMODATION.HELPFUL_ERROR_TITLE || "Error",
        mensaje: dict.CLIENT.ACCOMMODATION.HELPFUL_ERROR_MESSAGE || "No se pudo marcar la reseña como útil. Inténtalo de nuevo.",
        code: 500,
        tipo: "error",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener trofeos basado en rating (1-10)
  const getRatingTrophies = (rating: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5", 
      lg: "w-6 h-6"
    };

    const trophyCount = Math.floor(rating / 2);
    const hasHalfTrophy = rating % 2 === 1;

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: trophyCount }).map((_, i) => (
          <FaTrophy key={i} className={`${sizeClasses[size]} text-yellow-400`} />
        ))}
        
        {hasHalfTrophy && (
          <div className="relative">
            <FaTrophy className={`${sizeClasses[size]} text-gray-600`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <FaTrophy className={`${sizeClasses[size]} text-yellow-400`} />
            </div>
          </div>
        )}
        
        {Array.from({ length: 5 - trophyCount - (hasHalfTrophy ? 1 : 0) }).map((_, i) => (
          <FaTrophy key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-600`} />
        ))}
      </div>
    );
  };

  // Función para obtener el texto de calificación
  const getRatingText = (rating: number) => {
    if (rating >= 9) return dict.CLIENT.ACCOMMODATION.EXCELLENT || "Excelente";
    if (rating >= 7) return dict.CLIENT.ACCOMMODATION.VERY_GOOD || "Muy Bueno";
    if (rating >= 5) return dict.CLIENT.ACCOMMODATION.GOOD || "Bueno";
    if (rating >= 3) return dict.CLIENT.ACCOMMODATION.REGULAR || "Regular";
    return dict.CLIENT.ACCOMMODATION.MALO || "Malo";
  };

  // Función para obtener color basado en rating
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-green-400";
    if (rating >= 7) return "text-blue-400";
    if (rating >= 5) return "text-yellow-400";
    if (rating >= 3) return "text-orange-400";
    return "text-red-400";
  };

  const RatingBar = ({ rating, count }: { rating: number; count: number }) => {
    const percentage = summary ? (count / summary.totalReviews) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-3">
        {/* Rating number con fondo */}
        <div className="flex items-center space-x-2 w-12">
          <span className="text-sm text-glacier-200 font-medium w-6 text-center">{rating}</span>
          <FaTrophy className="w-3 h-3 text-yellow-400" />
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 bg-zinc-600 rounded-full h-2 min-w-0 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Count */}
        <span className="text-sm text-glacier-300 w-10 text-right font-medium">{count}</span>
      </div>
    );
  };

  // Componente de información sobre reseñas
  const ReviewInfoBanner = () => (
    <div className="bg-gradient-to-r from-glacier-800 to-glacier-700 rounded-lg p-4 mb-6 border border-glacier-600">
      <div className="flex items-start space-x-3">
        <FaInfoCircle className="text-glacier-300 mt-1 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-glacier-200 text-sm leading-relaxed">
            {dict.CLIENT.ACCOMMODATION.REVIEW_INFO || "Las reseñas solo se pueden escribir después de completar una estancia y se gestionan desde tu perfil"}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {isLoggedIn ? (
              <button
                onClick={handleGoToProfile}
                className="inline-flex items-center px-4 py-2 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <FaUserCircle className="mr-2" />
                {dict.CLIENT.ACCOMMODATION.GO_TO_PROFILE || "Ir al Perfil"}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <FaUser className="mr-2" />
                {dict.CLIENT.ACCOMMODATION.LOGIN_TO_REVIEW || "Inicia sesión para escribir una reseña"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-zinc-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-zinc-700 rounded-lg shadow-md p-6 border border-glacier-700 ${className}`}>
        <p className="text-red-400">
          {dict.CLIENT.ACCOMMODATION.ERROR_LOADING || "Error cargando reseñas:"} {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-zinc-700 rounded-lg shadow-md p-4 sm:p-6 border border-glacier-700 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-glacier-200 mb-2 border-b-2 border-glacier-500 pb-2">
            {dict.CLIENT.ACCOMMODATION.REVIEWS_TITLE || "Reseñas de Usuarios"}
          </h2>
          <p className="text-sm text-glacier-300">
            {dict.CLIENT.ACCOMMODATION.REVIEWS_SUBTITLE || "Lo que dicen otros huéspedes"}
          </p>
        </div>
        
        {summary && summary.totalReviews > 0 && (
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            <FaSort className="text-glacier-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-600 text-glacier-200 border border-zinc-500 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-glacier-500"
            >
              <option value="newest">{dict.CLIENT.ACCOMMODATION.SORT_OPTIONS?.NEWEST || "Más recientes"}</option>
              <option value="oldest">{dict.CLIENT.ACCOMMODATION.SORT_OPTIONS?.OLDEST || "Más antiguos"}</option>
              <option value="rating_high">{dict.CLIENT.ACCOMMODATION.SORT_OPTIONS?.RATING_HIGH || "Mejor valorados"}</option>
              <option value="rating_low">{dict.CLIENT.ACCOMMODATION.SORT_OPTIONS?.RATING_LOW || "Peor valorados"}</option>
              <option value="helpful">{dict.CLIENT.ACCOMMODATION.SORT_OPTIONS?.HELPFUL || "Más útiles"}</option>
            </select>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <ReviewInfoBanner />

      {summary && summary.totalReviews > 0 ? (
        <>
          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overall Rating  */}
            <div className="lg:col-span-1 flex justify-center items-center bg-zinc-800 rounded-lg p-6 border border-zinc-600 shadow-lg">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`text-6xl font-bold mb-3 ${getRatingColor(summary.averageRating)}`}>
                    {summary.averageRating.toFixed(1)}
                  </div>
                  <div className="text-lg font-semibold text-glacier-200 mb-3">
                    {getRatingText(summary.averageRating)}
                  </div>
                  <div className="flex justify-center mb-4">
                    {getRatingTrophies(summary.averageRating, "lg")}
                  </div>
                </div>
                
                <div className="border-t border-zinc-600 pt-4">
                  <p className="text-sm font-medium text-glacier-200 mb-1">
                    {(dict.CLIENT.ACCOMMODATION.REVIEWS_COUNT || "{{count}} reseñas").replace('{{count}}', summary.totalReviews.toString())}
                  </p>
                  <p className="text-xs text-glacier-400">
                    {(dict.CLIENT.ACCOMMODATION.RATING_OUT_OF_10 || "{{rating}} de 10").replace('{{rating}}', summary.averageRating.toFixed(1))}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution - Una sola columna vertical */}
            <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-600 shadow-lg">
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold text-glacier-200 mb-6 text-center lg:text-left">
                  {dict.CLIENT.ACCOMMODATION.RATING_BREAKDOWN || "Desglose de Valoraciones"}
                </h3>
                
                <div className="flex-1 flex flex-col justify-center space-y-2">
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                    <RatingBar
                      key={rating}
                      rating={rating}
                      count={summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Ratings */}
          {summary.detailedAverages && (
            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <h3 className="text-md font-semibold text-glacier-200 mb-4">
                {dict.CLIENT.ACCOMMODATION.DETAILED_RATINGS || "Valoraciones Detalladas"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(summary.detailedAverages).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className={`text-lg font-semibold mb-1 ${getRatingColor(value)}`}>
                      {value.toFixed(1)}
                    </div>
                    {getRatingTrophies(value, "sm")}
                    <p className="text-xs text-glacier-300 mt-2">
                      {dict.CLIENT.ACCOMMODATION[key.toUpperCase() as keyof typeof dict.CLIENT.ACCOMMODATION] || key}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.slice(0, showAll ? reviews.length : 6).map((review) => (
              <div key={review.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-glacier-600 rounded-full flex items-center justify-center">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full" />
                      ) : (
                        <FaUser className="text-glacier-200" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-glacier-100">{review.userName}</h4>
                      <div className="flex items-center space-x-2 text-xs text-glacier-400">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{formatDate(review.createdAt)}</span>
                        {review.isVerifiedStay && (
                          <>
                            <FaCheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">
                              {dict.CLIENT.ACCOMMODATION.VERIFIED_STAY || "Estancia Verificada"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold mb-1 ${getRatingColor(review.rating)}`}>
                      {review.rating}/10
                    </div>
                    {getRatingTrophies(review.rating, "sm")}
                    <p className="text-xs text-glacier-400 mt-1">
                      {getRatingText(review.rating)}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-3">
                  {review.title && (
                    <h5 className="font-medium text-glacier-200 mb-2">{review.title}</h5>
                  )}
                  <p className="text-glacier-300 text-sm leading-relaxed">{review.comment}</p>
                  
                  {(review.pros || review.cons) && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {review.pros && (
                        <div className="bg-zinc-700 rounded p-2">
                          <p className="text-xs font-medium text-green-400 mb-1">
                            {dict.CLIENT.ACCOMMODATION.PROS_LABEL || "Lo mejor:"}
                          </p>
                          <p className="text-xs text-glacier-300">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-zinc-700 rounded p-2">
                          <p className="text-xs font-medium text-red-400 mb-1">
                            {dict.CLIENT.ACCOMMODATION.CONS_LABEL || "A mejorar:"}
                          </p>
                          <p className="text-xs text-glacier-300">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Review Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-600">
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    disabled={helpfulReviews.has(review.id)}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      helpfulReviews.has(review.id)
                        ? 'text-glacier-500 cursor-not-allowed'
                        : 'text-glacier-400 hover:text-glacier-200 cursor-pointer'
                    }`}
                    title={!isLoggedIn 
                      ? (dict.CLIENT.ACCOMMODATION.LOGIN_TOOLTIP || "Inicia sesión para marcar como útil")
                      : (dict.CLIENT.ACCOMMODATION.HELPFUL_TOOLTIP || "Marcar como útil")
                    }
                  >
                    <FaThumbsUp className="w-3 h-3" />
                    <span>
                      {dict.CLIENT.ACCOMMODATION.HELPFUL || "Útil"} ({review.helpfulCount})
                    </span>
                  </button>
                  
                  {review.detailedRatings && (
                    <div className="flex space-x-2 text-xs text-glacier-400">
                      <span>L: {review.detailedRatings.cleanliness}/10</span>
                      <span>C: {review.detailedRatings.comfort}/10</span>
                      <span>U: {review.detailedRatings.location}/10</span>
                      <span>S: {review.detailedRatings.service}/10</span>
                      <span>V: {review.detailedRatings.value}/10</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {reviews.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors"
              >
                {showAll 
                  ? (dict.CLIENT.ACCOMMODATION.SHOW_LESS || "Ver Menos")
                  : (dict.CLIENT.ACCOMMODATION.SHOW_MORE || "Ver Más")
                }
              </button>
            </div>
          )}
        </>
      ) : (
        /* No Reviews State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrophy className="text-glacier-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-glacier-200 mb-2">
            {dict.CLIENT.ACCOMMODATION.NO_REVIEWS || "Aún no hay reseñas"}
          </h3>
          <p className="text-glacier-400 mb-6">
            {dict.CLIENT.ACCOMMODATION.NO_REVIEWS_DESC || "Sé el primero en compartir tu experiencia después de tu estancia"}
          </p>
          
          {isLoggedIn ? (
            <button 
              onClick={handleGoToProfile}
              className="inline-flex items-center px-6 py-3 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors font-medium"
            >
              <FaUserCircle className="mr-2" />
              {dict.CLIENT.ACCOMMODATION.WRITE_REVIEW_PROFILE || "Escribir Reseña desde tu Perfil"}
            </button>
          ) : (
            <div className="space-y-3">
              <button 
                onClick={handleLogin}
                className="inline-flex items-center px-6 py-3 bg-glacier-600 hover:bg-glacier-700 text-white rounded-lg transition-colors font-medium"
              >
                <FaUser className="mr-2" />
                {dict.CLIENT.ACCOMMODATION.LOGIN_TO_REVIEW || "Inicia sesión para escribir una reseña"}
              </button>
              <p className="text-xs text-glacier-400">
                {dict.CLIENT.ACCOMMODATION.REVIEW_INFO || "Las reseñas solo se pueden escribir después de completar una estancia y se gestionan desde tu perfil"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Componente de notificación al final */}
      {notification && (
        <NotificationComponent
          Notifications={notification}
          onClose={() => setNotification(undefined)}
        />
      )}
    </div>
  );
}