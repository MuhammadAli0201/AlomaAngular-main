import { Hospital } from "./hospital";

export interface Suburb {
    id: number;
    name: string;
    hospitals: Hospital[];
}
