export interface OrderApartmentVO {
  apartment_code: string;
  order_code: string;
  amount: number;
  discount: number;
  status: string;
  bill: Uint8Array;
}

export interface OrderFlightVO {
  flight_code: string;
  order_code: string;
  amount: number;
  discount: number;
  status: string;
  bill: Uint8Array;
}

export interface OrderHotelVO {
  hotel_code: string;
  order_code: string;
  amount: number;
  discount: number;
  status: string;
  bill: Uint8Array;
}
