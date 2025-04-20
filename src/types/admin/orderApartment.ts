export interface OrderApartmentVO {
  apartment_code: string;
  order_code: string;
  amount: number;
  discount: number;
  status: string;
  bill: Uint8Array;
}
