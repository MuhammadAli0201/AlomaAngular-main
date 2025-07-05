import { Suburb } from "./suburb";

export interface City {
    id: number;
    name: string;
    suburbs: Suburb[];
}
