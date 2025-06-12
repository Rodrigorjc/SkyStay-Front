import {
    FaWifi, FaSwimmingPool, FaDumbbell, FaCoffee, FaTv, FaParking,
    FaSpa, FaUtensils, FaWind, FaCocktail, FaLock, FaUmbrella,
    FaHotTub, FaWheelchair, FaUsers, FaPaw, FaBaby, FaShieldAlt,
    FaClock, FaPlane, FaTshirt
} from "react-icons/fa";
import { MdRoomService as FaConcierge, MdElevator as FaElevator, MdCleaningServices as FaBroom } from "react-icons/md";

// Mapa completo de amenities con sus iconos correspondientes
export const amenityIconMap: { [key: string]: JSX.Element } = {
    "WiFi": <FaWifi className="text-glacier-300" />,
    "Piscina": <FaSwimmingPool className="text-glacier-300" />,
    "Gimnasio": <FaDumbbell className="text-glacier-300" />,
    "Desayuno incluido": <FaCoffee className="text-glacier-300" />,
    "TV por cable": <FaTv className="text-glacier-300" />,
    "Estacionamiento": <FaParking className="text-glacier-300" />,
    "Spa": <FaSpa className="text-glacier-300" />,
    "Restaurante": <FaUtensils className="text-glacier-300" />,
    "Aire acondicionado": <FaWind className="text-glacier-300" />,
    "Bar": <FaCocktail className="text-glacier-300" />,
    "Lavandería": <FaTshirt className="text-glacier-300" />,
    "Servicio a la habitación": <FaConcierge className="text-glacier-300" />,
    "Caja fuerte": <FaLock className="text-glacier-300" />,
    "Terraza": <FaUmbrella className="text-glacier-300" />,
    "Jacuzzi": <FaHotTub className="text-glacier-300" />,
    "Accesibilidad": <FaWheelchair className="text-glacier-300" />,
    "Sala de conferencias": <FaUsers className="text-glacier-300" />,
    "Mascotas permitidas": <FaPaw className="text-glacier-300" />,
    "Servicio de limpieza": <FaBroom className="text-glacier-300" />,
    "Zona infantil": <FaBaby className="text-glacier-300" />,
    "Ascensor": <FaElevator className="text-glacier-300" />,
    "Seguridad 24h": <FaShieldAlt className="text-glacier-300" />,
    "Sauna": <FaHotTub className="text-glacier-300" />,
    "Gimnasio 24h": <FaClock className="text-glacier-300" />,
    "Transporte al aeropuerto": <FaPlane className="text-glacier-300" />
};

// Lista de todas las amenities disponibles para filtrar
export const amenitiesOptions = Object.keys(amenityIconMap);

// Función para obtener el icono de una amenity
export const getAmenityIcon = (amenity: string) => {
    return amenityIconMap[amenity] || null;
};