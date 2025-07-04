import { CityVO } from "@/types/admin/city";
// Interfaces utilizadas en la tabla de la administración de los vuelos
export interface FlightsTableVO {
  code: string;
  departureTime: string; // Hora de salida (horas, minutos, segundos)
  status: string;
  dateTime: Date; // Hora de llegada (año, mes, dia, horas, minutos, segundos)
  dateTimeArrival: Date; // Hora de llegada (año, mes, dia, horas, minutos, segundos)

  airline: AirlineTableVO;
  departureAirport: AirportTableVO;
  arrivalAirport: AirportTableVO;
  airplane: AirplaneTableVO;

  cabins: CabinsPriceVO[];
}

interface AirlineTableVO {
  code: string;
  name: string;
  iataCode: string;
}

interface AirportTableVO {
  code: string;
  name: string;
  iataCode: string;
  city: CityVO;
}

interface AirplaneTableVO {
  code: string;
  model: string;
  registrationNumber: string;
}

export interface FlightFormVO {
  dateTime: string;
  dateTimeArrival: string;
  airlineId: number;
  departureAirportId: number;
  arrivalAirportId: number;
  airplaneId: number;
  cabins: CabinsPriceVO[];
  meals: MealVO[];
}

interface MealVO {
  code: string;
}

export interface CabinsVO {
  id: number;
  seatClass: string;
}

export type CabinVO = CabinsVO[];

export interface CabinsPriceVO {
  id: number;
  price: number;
}

export interface CabinsInfoVO {
  id: number;
  seatClass: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}
