"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaMapMarkerAlt, FaEuroSign, FaStar } from "react-icons/fa";
import { Booking } from "../types/Profile";
import { getUserBookings } from "../services/profileService";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

interface BookingsTabProps {
  onNotification: (notification: any) => void;
}

interface BookingsResponse {
  bookings?: Booking[];
  data?: Booking[];
  total?: number;
}

export default function BookingsTab({ onNotification }: BookingsTabProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  // Mock generator basado en el número total
  const generateMockBookings = (totalCount: number): Booking[] => {
    const mockHotels = [
      { name: "Hotel Barceló Madrid", location: "Madrid, España" },
      { name: "Gran Hotel Inglés", location: "Madrid, España" },
      { name: "Hotel Majestic", location: "Barcelona, España" },
      { name: "Hotel Arts Barcelona", location: "Barcelona, España" },
      { name: "Alfonso XIII Hotel", location: "Sevilla, España" },
      { name: "Hotel Villa Magna", location: "Madrid, España" },
      { name: "Casa Fuster", location: "Barcelona, España" },
      { name: "Hotel Ritz Madrid", location: "Madrid, España" }
    ];

    const statuses: Array<'completed' | 'upcoming' | 'cancelled'> = ['completed', 'upcoming', 'cancelled'];
    
    const mockBookings: Booking[] = [];
    
    for (let i = 0; i < totalCount; i++) {
      const hotel = mockHotels[i % mockHotels.length];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generar fechas aleatorias
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 90) - 30);
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
      
      mockBookings.push({
        id: `booking_${i + 1}`,
        accommodationName: hotel.name,
        location: hotel.location,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        totalPrice: Math.floor(Math.random() * 500) + 100,
        status: status,
        canReview: status === 'completed' && Math.random() > 0.5,
      });
    }
    
    return mockBookings;
  };

  const formatDate = (dateString: string, formatStr: string = 'dd MMM yyyy') => {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      const date = parseISO(dateString);
      
      if (!isValid(date)) {
        const fallbackDate = new Date(dateString);
        if (isValid(fallbackDate)) {
          return format(fallbackDate, formatStr, { locale: es });
        }
        return 'Fecha inválida';
      }
      
      return format(date, formatStr, { locale: es });
    } catch (error) {
      console.error('Error formateando fecha:', error, 'dateString:', dateString);
      return 'Error en fecha';
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings() as BookingsResponse | Booking[];
      
      console.log('📋 Respuesta getUserBookings:', response);
      
      let hasRealData = false;
      
      // Handle different response structures
      if (Array.isArray(response)) {
        if (response.length > 0) {
          setBookings(response);
          hasRealData = true;
        }
      } else if (response && typeof response === 'object') {
        if ('bookings' in response && Array.isArray(response.bookings) && response.bookings.length > 0) {
          setBookings(response.bookings);
          hasRealData = true;
        } else if ('data' in response && Array.isArray(response.data) && response.data.length > 0) {
          setBookings(response.data);
          hasRealData = true;
        }
      }
      
      // Solo usar mock si NO hay datos reales
      if (!hasRealData) {
        console.log('🎭 No hay datos reales, usando mock');
        const mockBookings = generateMockBookings(5);
        setBookings(mockBookings);
      }
      
    } catch (error) {
      console.error('❌ Error cargando bookings:', error);
      
      // Solo en caso de error usar mock
      console.log('🎭 Error en API, usando mock por defecto');
      const mockBookings = generateMockBookings(3);
      setBookings(mockBookings);
      
      onNotification({
        titulo: "Error de conexión",
        mensaje: "No se pudieron cargar las reservas. Mostrando datos de ejemplo.",
        tipo: "warning",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
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
      case 'completed': return 'Completada';
      case 'upcoming': return 'Próxima';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const filterButtons = [
    { key: 'all', label: 'Todas' },
    { key: 'upcoming', label: 'Próximas' },
    { key: 'completed', label: 'Completadas' },
    { key: 'cancelled', label: 'Canceladas' }
  ] as const;

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
        <h2 className="text-xl font-bold text-glacier-100">
          Mis Reservas ({bookings.length})
        </h2>
        
        <div className="flex gap-2">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
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

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendarCheck className="text-4xl text-glacier-400 mx-auto mb-4 opacity-50" />
          <p className="text-glacier-400">No tienes reservas {filter !== 'all' ? getStatusText(filter).toLowerCase() : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-600 rounded-lg p-4 border border-glacier-700 hover:border-glacier-600 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-glacier-100 mb-2">
                    {booking.accommodationName}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-glacier-300">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      <span>{booking.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FaCalendarCheck />
                      <span>
                        {formatDate(booking.checkIn, 'dd MMM')} - {' '}
                        {formatDate(booking.checkOut, 'dd MMM yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FaEuroSign />
                      <span className="font-semibold">{booking.totalPrice}€</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                  
                  {booking.canReview && (
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