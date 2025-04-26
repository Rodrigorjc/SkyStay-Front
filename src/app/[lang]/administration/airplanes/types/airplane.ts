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
