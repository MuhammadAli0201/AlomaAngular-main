import { City } from "./city";

export interface Province {
    id: number;
    name: string;
    cities: City[];
}
