"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaPlane, FaHeart, FaStar } from "react-icons/fa";
import { ProfileStats } from "../types/Profile";

interface StatsCardsProps {
  stats: ProfileStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      icon: FaCalendarCheck,
      label: "Reservas",
      value: stats.totalBookings,
      color: "text-glacier-500"
    },
    {
      icon: FaPlane,
      label: "Vuelos",
      value: stats.totalFlights,
      color: "text-blue-500"
    },
    {
      icon: FaHeart,
      label: "Favoritos",
      value: stats.totalFavorites,
      color: "text-red-500"
    },
    {
      icon: FaStar,
      label: "Reseñas",
      value: stats.totalReviews,
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-700 rounded-xl border border-glacier-700 p-4 text-center"
        >
          <stat.icon className={`text-2xl ${stat.color} mx-auto mb-2`} />
          <div className="text-xl font-bold text-glacier-100">{stat.value}</div>
          <div className="text-glacier-400 text-sm">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}