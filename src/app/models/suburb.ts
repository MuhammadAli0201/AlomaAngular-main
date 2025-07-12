import { Hospital } from "./hospital";

export interface Suburb {
    suburbId: number;
    name: string;
    cityId: number;
    hospitals: Hospital[];
}
