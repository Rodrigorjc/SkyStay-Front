export interface CityVO {
  name: string;
  country: CountryVO;
}

interface CountryVO {
  name: string;
}

export interface CityTableVO {
  id: number;
  name: string;
}
