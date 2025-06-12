import { AirlineTableVO } from "@/app/[lang]/administration/airlines/types/airline";
import { AirportAdminVO } from "@/app/[lang]/administration/airports/types/airport";

export interface AllDetailsFlightsVO {
  depatureTime: string;
  flightStatus: string;
  dateTime: string;
  dateTimeArrival: string;
  airline: AirlineTableVO;
  departureAirport: AirportAdminVO;
  arrivalAirport: AirportAdminVO;
  airplane: AirplaneVO;
}

interface AirplaneVO {
  code: string;
  model: string;
  registrationNumber: string;
  yearOfManufacture: number;
  capacity: number;
  manufacturer: string;
  airplaneTypeName: string;
}

export interface CabinFlightDetailsVO {
  id: number;
  seatClass: string;
  seatPattern: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  seats: SeatVO[];
}

interface SeatVO {
  id: number;
  seatRow: string;
  seatColumn: string;
  state: boolean;
}
