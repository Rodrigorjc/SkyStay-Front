export interface AirplaneAllCodeVO {
  model: string;
  registrationNumber: string;
  yearOfManufacture: number;
  type: string;
  status: string;

  airplaneType_code: string;
  airplaneType_manufacturer: string;
  airplaneType_capacity: number;
}

export interface Seat {
  id: number;
  seatRow: string;
  seatColumn: string;
  state: boolean;
}

export interface Cabin {
  cabinId: number;
  seatconfigurationName: string;
  rowStart: number;
  rowEnd: number;
  seatClass: string;
  seats: Seat[];
}
