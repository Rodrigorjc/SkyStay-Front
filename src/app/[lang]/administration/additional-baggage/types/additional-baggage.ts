import { AirlineTableVO } from "../../flights/[flightsCode]/types/detailsFlight";

export interface AdditionalBaggageVO {
  name: string;
  weight: number;
  extraAmount: number;
  airline_id: number;
}

export interface AdditionalBaggageTableVO {
  id: number;
  name: string;
  weight: number;
  extraAmount: number;
  airline: AirlineTableVO;
}
