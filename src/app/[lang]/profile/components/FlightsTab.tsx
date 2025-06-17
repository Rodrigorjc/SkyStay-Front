"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlane, FaMapMarkerAlt, FaEuroSign, FaStar } from "react-icons/fa";
import { Flight } from "../types/Profile";
import { getUserFlights } from "../services/profileService";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface FlightsTabProps {
  onNotification: (notification: any) => void;
}

export default function FlightsTab({ onNotification }: FlightsTabProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const data = await getUserFlights();
      setFlights(data);
    } catch (error) {
      onNotification({
        titulo: "Error",
        mensaje: "Error al cargar los vuelos",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter(flight => 
    filter === 'all' || flight.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'upcoming': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-glacier-400 bg-glacier-500/20 border-glacier-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'upcoming': return 'Próximo';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-700 rounded-xl border border-glacier-700 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-zinc-600 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-700 rounded-xl border border-glacier-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-glacier-100">Mis Vuelos</h2>
        
        {/* Filtros */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'upcoming', label: 'Próximos' },
            { key: 'completed', label: 'Completados' },
            { key: 'cancelled', label: 'Cancelados' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === key
                  ? 'bg-glacier-600 text-white'
                  : 'text-glacier-300 hover:text-white hover:bg-zinc-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredFlights.length === 0 ? (
        <div className="text-center py-12">
          <FaPlane className="text-4xl text-glacier-400 mx-auto mb-4 opacity-50" />
          <p className="text-glacier-400">No tienes vuelos {filter !== 'all' ? getStatusText(filter).toLowerCase() : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-600 rounded-lg p-4 border border-glacier-700 hover:border-glacier-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-glacier-100">
                      {flight.flightCode}
                    </h3>
                    <span className="text-glacier-300">•</span>
                    <span className="text-glacier-300">{flight.airline}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-glacier-300">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      <span>{flight.origin} → {flight.destination}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FaPlane />
                      <span>
                        {format(parseISO(flight.departureDate), 'dd MMM yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FaEuroSign />
                      <span className="font-semibold">{flight.totalPrice}€</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(flight.status)}`}>
                    {getStatusText(flight.status)}
                  </span>
                  
                  {flight.canReview && (
                    <button className="flex items-center gap-1 text-glacier-400 hover:text-glacier-200 text-sm transition-colors">
                      <FaStar />
                      Escribir reseña
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}