"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaHeart, 
  FaStar, 
  FaMapMarkerAlt, 
  FaEye, 
  FaTrash,
  FaExternalLinkAlt,
  FaWifi,
  FaParking,
  FaSwimmingPool
} from "react-icons/fa";
import { getUserFavorites, removeFavorite } from "../services/profileService";
import { Favorite } from "../types/Profile";
import { Notifications } from "@/app/interfaces/Notifications";
import Loader from "@/app/components/ui/Loader";

interface FavoritesTabProps {
  onNotification: (notification: Notifications) => void;
}

export default function FavoritesTab({ onNotification }: FavoritesTabProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getUserFavorites();
      setFavorites(data);
    } catch (error: any) {
      console.error('Error al cargar favoritos:', error);
      onNotification({
        titulo: "Error",
        mensaje: "No se pudieron cargar los favoritos",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (accommodationCode: string, type: string) => {
    try {
      setRemoving(accommodationCode);
      await removeFavorite(accommodationCode, type);
      
      setFavorites(prev => prev.filter(fav => fav.accommodationCode !== accommodationCode));
      
      onNotification({
        titulo: "Favorito eliminado",
        mensaje: "El alojamiento se ha eliminado de tus favoritos",
        tipo: "success",
        code: 200
      });
    } catch (error: any) {
      console.error('Error al eliminar favorito:', error);
      onNotification({
        titulo: "Error",
        mensaje: "No se pudo eliminar el favorito",
        tipo: "error",
        code: 500
      });
    } finally {
      setRemoving(null);
    }
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${
          i < stars ? 'text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  const getAmenityIcons = (amenities: string) => {
    const amenityList = amenities?.toLowerCase() || '';
    const icons = [];
    
    if (amenityList.includes('wifi') || amenityList.includes('internet')) {
      icons.push(<FaWifi key="wifi" className="text-glacier-400" title="WiFi" />);
    }
    if (amenityList.includes('parking') || amenityList.includes('aparcamiento')) {
      icons.push(<FaParking key="parking" className="text-glacier-400" title="Parking" />);
    }
    if (amenityList.includes('piscina') || amenityList.includes('pool')) {
      icons.push(<FaSwimmingPool key="pool" className="text-glacier-400" title="Piscina" />);
    }
    
    return icons.slice(0, 3); // Máximo 3 iconos
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <FaHeart className="text-6xl text-gray-600 mb-4 mx-auto" />
        <h3 className="text-xl font-semibold text-glacier-200 mb-2">
          No tienes favoritos aún
        </h3>
        <p className="text-glacier-400">
          Explora alojamientos y guarda tus favoritos para encontrarlos fácilmente
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-glacier-200">
          Mis Favoritos ({favorites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite, index) => (
          <motion.div
            key={favorite.accommodationCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-800 rounded-xl border border-glacier-700 overflow-hidden hover:border-glacier-500 transition-all duration-300"
          >
            {/* Imagen */}
            <div className="relative h-48 bg-gray-700">
              {favorite.image || favorite.mainImage ? (
                <img
                  src={favorite.image || favorite.mainImage}
                  alt={favorite.accommodationName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">🏨</span>
                </div>
              )}
              
              {/* Badge del tipo */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  favorite.type === 'hotel' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {favorite.type === 'hotel' ? 'Hotel' : 'Apartamento'}
                </span>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleRemoveFavorite(favorite.accommodationCode, favorite.type)}
                disabled={removing === favorite.accommodationCode}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors"
                title="Eliminar de favoritos"
              >
                {removing === favorite.accommodationCode ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaHeart className="text-red-400 text-sm" />
                )}
              </button>
            </div>

            {/* Contenido */}
            <div className="p-4">
              {/* Nombre y estrellas */}
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-glacier-200 mb-1 line-clamp-2">
                  {favorite.accommodationName}
                </h3>
                <div className="flex items-center space-x-1">
                  {renderStars(favorite.stars)}
                  {favorite.averageRating && (
                    <span className="text-sm text-glacier-400 ml-2">
                      {favorite.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-center text-glacier-400 text-sm mb-2">
                <FaMapMarkerAlt className="mr-1" />
                <span>{favorite.cityName || favorite.location}</span>
              </div>

              {/* Precio */}
              {favorite.minPrice && (
                <div className="mb-3">
                  <span className="text-glacier-200 font-semibold">
                    desde €{favorite.minPrice}
                  </span>
                  <span className="text-glacier-400 text-sm ml-1">/ noche</span>
                </div>
              )}

              {/* Amenities */}
              {favorite.amenities && (
                <div className="flex items-center space-x-2 mb-3">
                  {getAmenityIcons(favorite.amenities)}
                </div>
              )}

              {/* Descripción */}
              {favorite.description && (
                <p className="text-glacier-400 text-sm mb-4 line-clamp-2">
                  {favorite.description}
                </p>
              )}

              {/* Acciones */}
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(favorite.viewUrl, '_blank')}
                  className="flex-1 bg-glacier-600 hover:bg-glacier-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FaEye />
                  <span>Ver</span>
                </button>
                
                <button
                  onClick={() => window.open(favorite.bookUrl, '_blank')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FaExternalLinkAlt />
                  <span>Reservar</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}