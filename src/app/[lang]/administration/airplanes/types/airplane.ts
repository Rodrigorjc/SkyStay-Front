export interface AirplaneShowVO {
  code: string;
  model: string;
  registrationNumber: string;
  yearOfManufacture: number;
  manufacturer: string;
  type: string;
  status: string;
  image: ImageVO;
  airplaneType: AirplaneTypeVO;
}

interface ImageVO {
  url: string;
}

interface AirplaneTypeVO {
  code: string;
  name: string;
  manufacturer: string;
  capacity: number;
}

export interface AirplaneForm1VO {
  // AirplaneType
  airplane_type_id: number;

  // Airplane
  model: string;
  registrationNumber: string;
  yearOfManufacture: number;

  //Enums
  status: string;
  type: string;
}

export interface AirplaneForm2VO {
  airplane_id: number;

  // Seat Configuration
  seat_configuration_id: number;

  // Airplane Cabin
  seat_class: string;
  rowStart: number;
  rowEnd: number;
}

export interface SeatConfigurationVO {
  id: number;
  seatClass: string;
  seatPattern: string;
}

export interface AirplanesTypesFormVO {
  id: number;
  name: string;
  manufacturer: string;
  capacity: number;
}

export interface CreateSeatConfigurationVO {
  seatPattern: string;
  description: string;
}
export interface CreateAirplanesTypesFormVO {
  name: string;
  manufacturer: string;
  capacity: number;
}
