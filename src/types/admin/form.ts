export interface AirportForm {
  name: string;
  iataCode: string;
  description: string;
  terminal: string;
  gate: string;
  latitude: number | string;
  longitude: number | string;
  timezone: string;
  city: string;
}

export interface AirportFormEdit {
  code: string;
  name: string;
  iataCode: string;
  description: string;
  terminal: string;
  gate: string;
  latitude: number | string;
  longitude: number | string;
  timezone: string;
  city: string;
}
