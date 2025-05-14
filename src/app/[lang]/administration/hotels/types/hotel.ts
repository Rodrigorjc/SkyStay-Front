import { CityVO } from "@/types/admin/city";

export interface HotelVO {
  code: string;
  name: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  description: string;
  stars: number;
  url: string;
  city: CityVO;
}

export interface HotelFormVO {
  name: string;
  address: string;
  postalCode: string;
  phone_number: string;
  email: string;
  website: string;
  description: string;
  cityId: number;
  rooms: RoomFormVO[];
}

export interface RoomFormVO {
  type: string;
  total_rooms: number;
  capacity: number;
}

export interface ShowHotelDetails {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  phone_number: string;
  email: string;
  website: string;
  stars: number;
  description: string;

  city: string;
  country: string;
  image: string;

  roomsDetails: ShowRoomsDetails[];
}

interface ShowRoomsDetails {
  roomCapacity: number;
  roomType: string;
  image: string;
  rooms: RoomVO[];
}

interface RoomVO {
  roomNumber: number;
  state: boolean;
}

export interface RoomConfigurationVO {
  id: number;
  capacity: number;
  type: string;
}

export interface AddRoomImageVO {
  hotelCode: string;
  roomType: string;
  url: string;
}

export interface EditHotelVO {
  code: string;
  phoneNumber: string;
  email: string;
  website: string;
  description: string;
}
