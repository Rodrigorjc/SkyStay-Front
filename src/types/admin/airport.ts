import { CityVO } from "./city";

export interface AirportAdminVO {
  name: string;
  code: string;
  iataCode: string;
  description: string;
  terminal: string;
  gate: string;
  latitude: number;
  longitude: number;
  timezone: string;
  city: CityVO;
}
