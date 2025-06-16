"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarCheck, 
  FaHeart, 
  FaStar, 
  FaCog,
  FaPlane
} from "react-icons/fa";
import { useDictionary } from "@/app/context/DictionaryContext";
import { getUserProfile, getProfileStats } from "./services/profileService";
import { User, ProfileStats } from "./types/Profile";
import ProfileHeader from "./components/ProfileHeader";
import StatsCard from "./components/StatsCards";
import ProfileTabs from "./components/ProfileTabs";
import BookingsTab from "./components/BookingsTab";
import ReviewsTab from "./components/ReviewsTab";
import FavoritesTab from "./components/FavoritesTab";
import SettingsTab from "./components/SettingsTab";
import FlightsTab from "./components/FlightsTab";
import NotificationComponent from "@components/Notification";
import { Notifications } from "@/app/interfaces/Notifications";
import Loader from "@/app/components/ui/Loader";

export default function ProfilePage() {
  const { dict } = useDictionary();
  const [activeTab, setActiveTab] = useState<"bookings" | "flights" | "reviews" | "favorites" | "settings">("bookings");
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notifications>();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        getUserProfile(),
        getProfileStats()
      ]);
      
      setProfile(profileData);
      setStats(statsData);
    } catch (error: any) {
      setNotification({
        titulo: "Error",
        mensaje: error.message || "Error al cargar el perfil",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
  };

  const tabs = [
    {
      id: "bookings" as const,
      label: "Alojamientos",
      icon: FaCalendarCheck,
      count: stats?.totalBookings
    },
    {
      id: "flights" as const,
      label: "Vuelos",
      icon: FaPlane,
      count: stats?.totalFlights
    },
    {
      id: "reviews" as const,
      label: "Reseñas",
      icon: FaStar,
      count: stats?.totalReviews
    },
    {
      id: "favorites" as const,
      label: "Favoritos",
      icon: FaHeart,
      count: stats?.totalFavorites
    },
    {
      id: "settings" as const,
      label: "Configuración",
      icon: FaCog
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-glacier-300 mt-4">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-zinc-700 rounded-xl border border-glacier-700 p-8 max-w-md">
            <h2 className="text-xl font-bold text-glacier-200 mb-4">
              Error al cargar el perfil
            </h2>
            <p className="text-glacier-400 mb-6">
              No se pudieron cargar los datos del perfil. Por favor, inténtalo de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-glacier-600 hover:bg-glacier-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <NotificationComponent
            Notifications={notification}
            onClose={() => setNotification(undefined)}
          />
        )}

        <div className="space-y-8">
          {/* Header del perfil */}
          <ProfileHeader 
            user={profile} 
            onUserUpdate={handleProfileUpdate}
            onNotification={setNotification}
          />

          {/* Estadísticas */}
          <StatsCard stats={stats} />

          {/* Tabs de navegación */}
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId: string) => setActiveTab(tabId as typeof activeTab)}
          />

          {/* Contenido de las tabs */}
          <motion.div
            className="mt-8"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "bookings" && (
                <BookingsTab onNotification={setNotification} />
              )}
              {activeTab === "flights" && (
                <FlightsTab onNotification={setNotification} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab onNotification={setNotification} />
              )}
              {activeTab === "favorites" && (
                <FavoritesTab onNotification={setNotification} />
              )}
              {activeTab === "settings" && (
                <SettingsTab 
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                  onNotification={setNotification}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}