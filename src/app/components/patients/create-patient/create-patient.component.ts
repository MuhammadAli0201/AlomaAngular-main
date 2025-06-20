import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { EMPTY_GUID } from '../../../constants/constants';

@Component({
  selector: 'app-create-patient',
  standalone: false,
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
  patientForm!: FormGroup;
  loading: boolean = false;
  btnLoading: boolean = false;
  patient!: Patient;

  resuscitationOptions = [
    { label: 'None', value: 'None' },
    { label: 'Oxygen', value: 'Oxygen' },
    { label: 'Face mask ventilation (incl. Neopuff)', value: 'Face mask ventilation (incl. Neopuff)' },
    { label: 'Endotracheal tube ventilation', value: 'Endotracheal tube ventilation' },
    { label: 'Adrenaline / Epinephrine', value: 'Adrenaline / Epinephrine' },
    { label: 'Chest compressions', value: 'Chest compressions' },
    { label: 'Nasal CPAP', value: 'Nasal CPAP' },
    { label: 'Laryngeal mask airway', value: 'Laryngeal mask airway' },
    { label: 'Nasal ventilation', value: 'Nasal ventilation' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  hospitalList = [
    'Hospital A', 'Hospital B', 'Hospital C', 'Hospital D', 'Other'
  ];
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Intersex', value: 'Intersex' }
  ];
  placeOfBirthOptions = [
    { label: 'Hospital', value: 'Hospital' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Home', value: 'Home' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  modeOfDeliveryOptions = [
    { label: 'Normal vaginal delivery', value: 'Normal vaginal delivery' },
    { label: 'Vaginal breech', value: 'Vaginal breech' },
    { label: 'Assisted vaginal delivery', value: 'Assisted vaginal delivery' },
    { label: 'Caesarean section (elective)', value: 'Caesarean section (elective)' },
    { label: 'Caesarean section (emergency)', value: 'Caesarean section (emergency)' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  outcomeStatusOptions = [
    { label: 'Discharged', value: 'Discharged' },
    { label: 'Discharged to surgical ward', value: 'Discharged to surgical ward' },
    { label: 'Discharged to medical ward', value: 'Discharged to medical ward' },
    { label: 'Transferred to another hospital', value: 'Transferred to another hospital' },
    { label: 'Died', value: 'Died' },
    { label: 'Hospitalised on first birthday', value: 'Hospitalised on first birthday' },
    { label: 'N/A', value: 'N/A' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  apgarTimeOptions = [
    { label: '1 minute', value: 'apgar1' },
    { label: '5 minutes', value: 'apgar5' },
    { label: '10 minutes', value: 'apgar10' }
  ];
  birthHivPcrOptions = [
    { label: 'Not applicable', value: 'Not applicable' },
    { label: 'Not done', value: 'Not done' },
    { label: 'Outstanding', value: 'Outstanding' },
    { label: 'Negative', value: 'Negative' },
    { label: 'Positive', value: 'Positive' }
  ];
  diedInDeliveryRoomOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  diedIn12Hours = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  //LIFE CYCLES
  constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router,
    private activeRoute: ActivatedRoute, private notificationService: NzNotificationService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      id: [EMPTY_GUID],
      hospitalNumber: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      dateOfAdmission: [null, Validators.required],
      ageOnAdmission: [null, Validators.required],
      birthWeight: [null, Validators.required],
      gestationalAge: [null],
      gender: [null, Validators.required],
      placeOfBirth: [null, Validators.required],
      modeOfDelivery: [null, Validators.required],
      initialResuscitation: [[]],
      apgarTimes: [[]],
      outcomeStatus: [null, Validators.required],
      transferHospital: [''],
      birthHivPcr: [null, Validators.required],
      headCircumference: [null],
      footLength: [null],
      lengthAtBirth: [null],
      diedInDeliveryRoom: [null, Validators.required],
      diedWithin12Hours: [null, Validators.required],
      initialTemperature: [null]
    });

    const id = this.activeRoute.parent?.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.patientService.getPatientById(id).subscribe({
        next: (val: Patient) => {
          this.patientForm.patchValue(val);
          this.patient = val;
          this.loading = false
        },
        error: (err: any) => {
          this.notificationService.error("error", err.message)
          this.loading = false
        },
      });
    }

  }

  //GETTERS
  get outcomeStatus() {
    return this.patientForm.get('outcomeStatus')?.value;
  }

  //UI LOGIC
  disableDate = (date: Date): boolean => date > new Date();

  onSubmit(): void {
    console.log(this.patientForm.value)
    if (this.patientForm.valid) {
      this.btnLoading = true;
      this.patientService.createPatient(this.patientForm.getRawValue())
        .subscribe({
          next: (res) => {
            this.router.navigate(['doctor-dashboard', 'patient', res.id, 'maternal'])
            this.btnLoading = false
          },
          error: (err) => {
            this.notificationService.error("error", err.message)
            this.btnLoading = false
          },
        });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }

  openPpipForm(): void {
    alert('PPIP form should open here.');
  }
}
