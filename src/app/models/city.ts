import { Suburb } from "./suburb";

export interface City {
    cityId: number;
    name: string;
    provinceId: number;
    suburbs: Suburb[];
}
