import { Hospital } from "./hospital";

export interface Suburb {
    suburbId: number;
    name: string;
    cityId: number;
    provinceId: number;
    hospitals: Hospital[];
}
