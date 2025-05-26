import { CityVO } from "@/types/admin/city";

// PAGINA DE DETALLES DE VUELO
export interface FlightsDetailsVO {
  code: string;
  departureTime: string;
  status: string;
  dateTime: Date;
  dateTimeArrival: Date;

  airline: AirlineTableVO;
  departureAirport: AirportAdminVO;
  arrivalAirport: AirportAdminVO;
  airplane: AirplaneShowVO;
}

export interface AirplaneShowVO {
  code: string;
  model: string;
  registrationNumber: string;
  yearOfManufacture: number;
  type: string; // AirplaneTypeEnum
  status: string; // Status
  airplaneType: any; // AirplaneTypeVO, define as needed
}

export interface AirportAdminVO {
  code: string;
  name: string;
  iataCode: string;
  description: string;
  terminal: string;
  gate: string;
  latitude: number;
  longitude: number;
  timezone: string;
  city: CityVO;
}

export interface AirlineTableVO {
  code: string;
  name: string;
  image: string;
  phone: string;
  email: string;
  website: string;
  iataCode: string;
}
