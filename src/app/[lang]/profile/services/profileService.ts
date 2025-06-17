import axiosClient from "@/lib/axiosClient";
import { 
  User, 
  ProfileStats, 
  Booking, 
  Flight, 
  Favorite, 
  Review, 
  UpdateProfileData, 
  ChangePasswordData, 
  CreateReviewData 
} from "../types/Profile";

// Obtener información del usuario
export const getUserProfile = async (): Promise<User> => {
  try {
    console.log('🚀 Iniciando petición getUserProfile...');
    
    const response = await axiosClient.get('/user/profile');
    
    console.log('📦 Response completa getUserProfile:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos getUserProfile:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.messages:', response.data?.messages);
    
    const data = response.data?.response?.objects || response.data?.objects || response.data;
    
    console.log('✅ Datos finales getUserProfile:', data);
    
    return {
      userCode: data.userCode || '',
      name: data.name || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      img: data.img || '',
      validation: data.validation || false,
      rol: data.rol || 'USER',
      birthDate: data.birthDate || '',
      gender: data.gender || '',
      nif: data.nif || '',
      createdAt: data.createdAt || ''
    };
  } catch (error: any) {
    console.error('❌ Error getUserProfile:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};

// Obtener estadísticas del perfil
export const getProfileStats = async (): Promise<ProfileStats> => {
  try {
    console.log('🚀 Iniciando petición getProfileStats...');
    
    const response = await axiosClient.get('/user/stats');
    
    console.log('📦 Response completa getProfileStats:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos getProfileStats:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.messages:', response.data?.messages);
    
    const data = response.data?.response?.objects || response.data?.objects || response.data;
    
    console.log('✅ Datos finales getProfileStats:', data);
    
    return {
      totalBookings: data.totalBookings || 0,
      totalFlights: data.totalFlights || 0,
      totalFavorites: data.totalFavorites || 0,
      totalReviews: data.totalReviews || 0,
      memberSince: data.memberSince || new Date().toISOString()
    };
  } catch (error: any) {
    console.error('❌ Error getProfileStats:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    // Retornar datos por defecto en caso de error
    return {
      totalBookings: 0,
      totalFlights: 0,
      totalFavorites: 0,
      totalReviews: 0,
      memberSince: new Date().toISOString()
    };
  }
};

// Obtener reservas de alojamientos
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    console.log('🚀 Iniciando petición getUserBookings...');
    
    const response = await axiosClient.get('/user/bookings');
    
    console.log('📦 Response completa getUserBookings:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos getUserBookings:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.items:', response.data?.items);
    console.log('- response.data.messages:', response.data?.messages);
    
    const data = response.data?.response?.objects || response.data?.objects || response.data?.items || response.data || [];
    
    console.log('✅ Datos finales getUserBookings:', data);
    console.log('📊 Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
    console.log('📈 Cantidad de elementos:', Array.isArray(data) ? data.length : 'No es array');
    
    return Array.isArray(data) ? data.map((booking: any, index: number) => {
      console.log(`🏨 Booking ${index}:`, booking);
      return {
        id: booking.id || '',
        accommodationName: booking.accommodationName || '',
        location: booking.location || '',
        checkIn: booking.checkIn || '',
        checkOut: booking.checkOut || '',
        status: booking.status || 'upcoming',
        totalPrice: booking.totalPrice || 0,
        canReview: booking.canReview || false
      };
    }) : [];
  } catch (error: any) {
    console.error('❌ Error getUserBookings:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return [];
  }
};

// Obtener vuelos
export const getUserFlights = async (): Promise<Flight[]> => {
  try {
    console.log('🚀 Iniciando petición getUserFlights...');
    
    const response = await axiosClient.get('/user/flights');
    
    console.log('📦 Response completa getUserFlights:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos getUserFlights:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.items:', response.data?.items);
    console.log('- response.data.messages:', response.data?.messages);
    
    const data = response.data?.response?.objects || response.data?.objects || response.data?.items || response.data || [];
    
    console.log('✅ Datos finales getUserFlights:', data);
    console.log('📊 Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
    console.log('📈 Cantidad de elementos:', Array.isArray(data) ? data.length : 'No es array');
    
    return Array.isArray(data) ? data.map((flight: any, index: number) => {
      console.log(`✈️ Flight ${index}:`, flight);
      return {
        id: flight.id || '',
        flightCode: flight.flightCode || '',
        airline: flight.airline || '',
        origin: flight.origin || '',
        destination: flight.destination || '',
        departureDate: flight.departureDate || '',
        status: flight.status || 'upcoming',
        totalPrice: flight.totalPrice || 0,
        canReview: flight.canReview || false
      };
    }) : [];
  } catch (error: any) {
    console.error('❌ Error getUserFlights:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return [];
  }
};

// Obtener favoritos - VERSIÓN ACTUALIZADA
export const getUserFavorites = async (): Promise<Favorite[]> => {
  try {
    console.log('🚀 Iniciando petición getUserFavorites...');
    
    const response = await axiosClient.get('/user/favorites');
    
    console.log('✅ Response getUserFavorites:', response.data);
    
    const data = response.data.objects;
    const favorites = data.favorites || [];
    
    console.log('📊 Favorites extraídos:', favorites);
    console.log('📈 Cantidad:', favorites.length);
    
    return favorites.map((favorite: any, index: number) => {
      console.log(`❤️ Favorite ${index}:`, favorite);
      return {
        // Campos básicos
        accommodationCode: favorite.code || '',
        accommodationName: favorite.name || '',
        type: favorite.type || 'hotel',
        stars: favorite.stars || 0,
        description: favorite.description || '',
        
        // Ubicación
        location: favorite.cityName || '',
        cityName: favorite.cityName || '',
        countryName: favorite.countryName || '',
        continent: favorite.continent || '',
        address: favorite.address || '',
        postalCode: favorite.postalCode || '',
        
        // Precios
        price: favorite.minPrice || 0,
        minPrice: favorite.minPrice || 0,
        maxPrice: favorite.maxPrice || 0,
        currency: favorite.currency || 'EUR',
        priceDisplay: favorite.priceDisplay || (favorite.minPrice ? `€${favorite.minPrice}` : ''),
        
        // Calificaciones
        rating: favorite.averageRating || 0,
        averageRating: favorite.averageRating || 0,
        totalReviews: favorite.totalReviews || 0,
        
        // Imágenes
        image: favorite.mainImage || '',
        mainImage: favorite.mainImage || '',
        images: favorite.images || [],
        
        // Información adicional
        amenities: favorite.amenities || '',
        phone: favorite.phone || '',
        email: favorite.email || '',
        website: favorite.website || '',
        
        // Estado
        isAvailable: favorite.available || false,
        totalRooms: favorite.totalRooms || 0,
        addedDate: favorite.addedDate || new Date().toISOString(),
        
        // Para mostrar en la UI
        locationDisplay: favorite.locationDisplay || favorite.cityName || '',
        featuresDisplay: favorite.featuresDisplay || '',
        
        // Enlaces
        viewUrl: favorite.viewUrl || `/accommodation/${favorite.type}/${favorite.code}`,
        bookUrl: favorite.bookUrl || `/book/${favorite.type}/${favorite.code}`,
      };
    });
  } catch (error: any) {
    console.error('❌ Error getUserFavorites:', error);
    return [];
  }
};

// Obtener reseñas del usuario
export const getUserReviews = async (): Promise<Review[]> => {
  try {
    console.log('🚀 Iniciando petición getUserReviews...');
    
    const response = await axiosClient.get('/user/reviews');
    
    console.log('📦 Response completa getUserReviews:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos getUserReviews:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.items:', response.data?.items);
    console.log('- response.data.messages:', response.data?.messages);
    
    const data = response.data?.response?.objects?.items || response.data?.objects?.items || response.data?.items || response.data || [];
    
    console.log('✅ Datos finales getUserReviews:', data);
    console.log('📊 Tipo de datos:', Array.isArray(data) ? 'Array' : typeof data);
    console.log('📈 Cantidad de elementos:', Array.isArray(data) ? data.length : 'No es array');
    
    return Array.isArray(data) ? data.map((review: any, index: number) => {
      console.log(`⭐ Review ${index}:`, review);
      return {
        id: review.id || '',
        type: review.type || 'accommodation',
        targetName: review.targetName || review.entityName || '',
        rating: review.rating || 0,
        comment: review.comment || '',
        createdAt: review.createdAt || ''
      };
    }) : [];
  } catch (error: any) {
    console.error('❌ Error getUserReviews:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return [];
  }
};

// Actualizar perfil
export const updateUserProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    console.log('🚀 Iniciando petición updateUserProfile con datos:', data);
    
    const response = await axiosClient.put('/user/profile', data);
    
    console.log('📦 Response completa updateUserProfile:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos updateUserProfile:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.messages:', response.data?.messages);
    
    const responseData = response.data?.response?.objects || response.data?.objects || response.data;
    
    console.log('✅ Datos finales updateUserProfile:', responseData);
    
    return {
      userCode: responseData.userCode || '',
      name: responseData.name || '',
      lastName: responseData.lastName || '',
      email: responseData.email || '',
      phone: responseData.phone || '',
      img: responseData.img || '',
      validation: responseData.validation || false,
      rol: responseData.rol || 'USER',
      birthDate: responseData.birthDate || '',
      gender: responseData.gender || '',
      nif: responseData.nif || '',
      createdAt: responseData.createdAt || ''
    };
  } catch (error: any) {
    console.error('❌ Error updateUserProfile:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};

// Cambiar contraseña
export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  try {
    console.log('🚀 Iniciando petición changePassword...');
    console.log('📤 Datos enviados (sin contraseñas):', { 
      hasCurrentPassword: !!data.currentPassword,
      hasNewPassword: !!data.newPassword 
    });
    
    const response = await axiosClient.put('/user/password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
    
    console.log('📦 Response completa changePassword:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('✅ Contraseña cambiada exitosamente');
  } catch (error: any) {
    console.error('❌ Error changePassword:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};

// Crear reseña
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  try {
    console.log('🚀 Iniciando petición createReview con datos:', data);
    
    const response = await axiosClient.post('/user/reviews', data);
    
    console.log('📦 Response completa createReview:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('🔍 Analizando estructura de datos createReview:');
    console.log('- response.data:', response.data);
    console.log('- response.data.response:', response.data?.response);
    console.log('- response.data.response.objects:', response.data?.response?.objects);
    console.log('- response.data.objects:', response.data?.objects);
    console.log('- response.data.messages:', response.data?.messages);
    
    const responseData = response.data?.response?.objects || response.data?.objects || response.data;
    
    console.log('✅ Datos finales createReview:', responseData);
    
    return {
      id: responseData.id || '',
      type: responseData.type || 'accommodation',
      targetName: responseData.targetName || responseData.entityName || '',
      rating: responseData.rating || 0,
      comment: responseData.comment || '',
      createdAt: responseData.createdAt || ''
    };
  } catch (error: any) {
    console.error('❌ Error createReview:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};

// Eliminar favorito
export const removeFavorite = async (accommodationCode: string, accommodationType: string): Promise<void> => {
  try {
    console.log('🚀 Iniciando petición removeFavorite para:', accommodationCode);
    
    const response = await axiosClient.delete(`/user/favorites/${accommodationCode}`);
    
    console.log('📦 Response completa removeFavorite:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    
    console.log('✅ Favorito eliminado exitosamente');
  } catch (error: any) {
    console.error('❌ Error removeFavorite:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
};

// Subir imagen de perfil
export const uploadProfileImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axiosClient.post('/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data?.response?.objects || response.data?.imageUrl || '';
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};