export interface AirlineTableVO {
  code: string;
  name: string;
  image: string;
  phone: string;
  email: string;
  website: string;
  iataCode: string;
}

export interface AirlineAddVO {
  name: string;
  phone: string;
  email: string;
  website: string;
  iataCode: string;
}

export interface AirlineEditVO {
  code: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  iataCode: string;
}

export interface AirlineAddImageVO {
  code: string;
  url: string;
}
