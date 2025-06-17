"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaPlus, FaTimes, FaHotel, FaPlane } from "react-icons/fa";
import { Review, CreateReviewData } from "../types/Profile";
import { getUserReviews, createReview } from "../services/profileService";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

interface ReviewsTabProps {
  onNotification: (notification: any) => void;
}

export default function ReviewsTab({ onNotification }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateReviewData>({
    type: 'accommodation',
    targetCode: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getUserReviews();
      setReviews(data);
    } catch (error) {
      onNotification({
        titulo: "Error",
        mensaje: "Error al cargar las reseñas",
        tipo: "error",
        code: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetCode.trim() || !formData.comment.trim()) {
      onNotification({
        titulo: "Error",
        mensaje: "Todos los campos son obligatorios",
        tipo: "error",
        code: 400
      });
      return;
    }

    try {
      const newReview = await createReview(formData);
      setReviews(prev => [newReview, ...prev]);
      setShowCreateForm(false);
      setFormData({
        type: 'accommodation',
        targetCode: '',
        rating: 5,
        comment: ''
      });
      
      onNotification({
        titulo: "¡Éxito!",
        mensaje: "Reseña creada correctamente",
        tipo: "success",
        code: 200
      });
    } catch (error) {
      onNotification({
        titulo: "Error",
        mensaje: "Error al crear la reseña",
        tipo: "error",
        code: 500
      });
    }
  };

  // Función para formatear fecha de forma segura
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      // Intentar parsear la fecha
      const date = parseISO(dateString);
      
      // Verificar si la fecha es válida
      if (!isValid(date)) {
        // Si no es válida, intentar crear una nueva fecha
        const fallbackDate = new Date(dateString);
        if (isValid(fallbackDate)) {
          return format(fallbackDate, 'dd MMM yyyy', { locale: es });
        }
        return 'Fecha inválida';
      }
      
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error formateando fecha:', error, 'dateString:', dateString);
      return 'Error en fecha';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="bg-zinc-700 rounded-xl border border-glacier-700 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-600 rounded-lg"></div>
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
        <h2 className="text-xl font-bold text-glacier-100">Mis Reseñas</h2>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-glacier-600 hover:bg-glacier-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaPlus />
          Nueva Reseña
        </button>
      </div>

      {/* Formulario crear reseña */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-600 rounded-lg p-4 mb-6 border border-glacier-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-glacier-100">Nueva Reseña</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-glacier-400 hover:text-glacier-200"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-glacier-300 mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'accommodation' | 'airline' }))}
                  className="w-full bg-zinc-700 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100"
                >
                  <option value="accommodation">Alojamiento</option>
                  <option value="airline">Aerolínea</option>
                </select>
              </div>

              <div>
                <label className="block text-glacier-300 mb-2">Código</label>
                <input
                  type="text"
                  value={formData.targetCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCode: e.target.value }))}
                  placeholder="Código del alojamiento o aerolínea"
                  className="w-full bg-zinc-700 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-glacier-300 mb-2">Puntuación</label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
                    className="text-2xl transition-colors"
                  >
                    <FaStar className={i < formData.rating ? 'text-yellow-500' : 'text-gray-400'} />
                  </button>
                ))}
                <span className="text-glacier-300 ml-2">{formData.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-glacier-300 mb-2">Comentario</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Comparte tu experiencia..."
                rows={4}
                className="w-full bg-zinc-700 border border-glacier-600 rounded-lg px-3 py-2 text-glacier-100 resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-glacier-600 hover:bg-glacier-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Publicar Reseña
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-zinc-600 hover:bg-zinc-500 text-glacier-200 px-6 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de reseñas */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <FaStar className="text-4xl text-glacier-400 mx-auto mb-4 opacity-50" />
          <p className="text-glacier-400">No has escrito ninguna reseña</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-600 rounded-lg p-4 border border-glacier-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.type === 'accommodation' ? (
                    <FaHotel className="text-2xl text-glacier-400" />
                  ) : (
                    <FaPlane className="text-2xl text-glacier-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-glacier-100">
                      {review.targetName}
                    </h3>
                    <span className="text-glacier-400 text-sm">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-glacier-300 text-sm">({review.rating}/5)</span>
                  </div>

                  <p className="text-glacier-200 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}