"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  FaHeart, 
  FaStar, 
  FaMapMarkerAlt, 
  FaEye, 
  FaWifi,
  FaParking,
  FaSwimmingPool
} from "react-icons/fa";
import { getUserFavorites } from "../services/profileService";
import { toggleFavoriteAccommodation } from "../../accommodation/services/accommodationService";
import { Favorite } from "../types/Profile";
import { Notifications } from "@/app/interfaces/Notifications";
import { useDictionary } from "@/app/context/DictionaryContext";
import Loader from "@/app/components/ui/Loader";

interface FavoritesTabProps {
  onNotification: (notification: Notifications) => void;
}

export default function FavoritesTab({ onNotification }: FavoritesTabProps) {
  const { dict } = useDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  // Extraer el idioma de la URL actual
  const lang = pathname.split("/")[1] || "en";

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

  const handleRemoveFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>,
    favorite: Favorite
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const token = Cookies.get("token");
    if (!token) {
      onNotification({
        titulo: dict?.CLIENT?.CARD?.NOTIF?.LOGIN_REQUIRED?.TITLE || "Iniciar sesión requerido",
        mensaje: dict?.CLIENT?.CARD?.NOTIF?.LOGIN_REQUIRED?.MESSAGE || "Debes iniciar sesión para gestionar favoritos",
        code: 401,
        tipo: "warning",
      });
      return;
    }

    if (removing === favorite.accommodationCode) return;

    try {
      setRemoving(favorite.accommodationCode);
      
      // Usar toggleFavoriteAccommodation para eliminar (el favorito actual es true, así que lo toggleamos para eliminarlo)
      await toggleFavoriteAccommodation(
        favorite.accommodationCode,
        favorite.type,
        true // Pasamos true porque queremos eliminarlo (toggle de true a false)
      );
      
      // Actualizar la lista local eliminando el favorito
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.accommodationCode !== favorite.accommodationCode)
      );

      onNotification({
        titulo: "Éxito",
        mensaje: "Favorito eliminado correctamente",
        tipo: "success",
        code: 200
      });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      onNotification({
        titulo: dict?.CLIENT?.CARD?.NOTIF?.ERROR?.FAVORITE?.TITLE || "Error",
        mensaje: dict?.CLIENT?.CARD?.NOTIF?.ERROR?.FAVORITE?.MESSAGE || "Error al eliminar favorito",
        code: 500,
        tipo: "error",
      });
    } finally {
      setRemoving(null);
    }
  };

  // Función para redirigir al alojamiento
  const handleViewAccommodation = (favorite: Favorite) => {
    const accommodationUrl = `/${lang}/accommodation/${favorite.accommodationCode}`;
    console.log('🔗 Redirigiendo a:', accommodationUrl);
    router.push(accommodationUrl);
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
                onClick={(e) => handleRemoveFavorite(e, favorite)}
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
                  onClick={() => handleViewAccommodation(favorite)}
                  className="flex-1 bg-glacier-600 hover:bg-glacier-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <FaEye />
                  <span>Ver</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}