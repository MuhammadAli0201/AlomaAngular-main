import { City } from "./city";
import { Hospital } from "./hospital";
import { Province } from "./province";
import { Suburb } from "./suburb";

export interface Patient {
  id?: string;
  hospitalNumber?: string;
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  dateOfAdmission?: string;
  ageOnAdmission?: number;
  birthWeight?: number;
  gestationalUnit?:string;
  gestationalAge?: number;
  gender?: string;
  placeOfBirth?: string;
  provinceId: number;
  province: Province;
  cityId: number;
  city: City;
  suburbId: number;
  suburb: Suburb;
  hospitalId: number;
  hospital: Hospital;
  modeOfDelivery?: string;
  initialResuscitation?: string[];
  oneMinuteApgar:string,
  fiveMinuteApgar:string,
  tenMinuteApgar:string,
  outcomeStatus?: string;
  transferHospital?: string;
  birthHivPcr?: string;
  headCircumference?: number;
  footLength?: number;
  lengthAtBirth?: number;
  diedInDeliveryRoom?: boolean;
  diedWithin12Hours?: boolean;
  initialTemperature?: number;
}