export interface Patient {
  id?: string;
  hospitalNumber?: string;
  name?: string;
  surname?: string;
  dateOfBirth?: string;
  dateOfAdmission?: string;
  ageOnAdmission?: number;
  birthWeight?: number;
  gestationalAge?: number;
  gender?: string;
  placeOfBirth?: string;
  modeOfDelivery?: string;
  initialResuscitation?: string[];
  apgarTimes?: string[];
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