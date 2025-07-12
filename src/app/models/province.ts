import { City } from "./city";

export interface Province {
    provinceId: number;
    name: string;
    cities: City[];
}
