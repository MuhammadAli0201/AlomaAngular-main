import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { EMPTY_GUID } from '../../../constants/constants';
import { AuthService } from '../../../services/auth.service';
import { strictDecimalValidator } from '../../../validators/strict-decimal';
import { SharedService } from '../../../services/shared.service';
import { Province } from '../../../models/province';
import { City } from '../../../models/city';
import { Suburb } from '../../../models/suburb';
import { Hospital } from '../../../models/hospital';

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

  rolesPath = {
    admin: 'admin-dashboard',
    intern: 'intern-dashboard',
    doctor: 'doctor-dashboard'
  }

  provinces: Province[] = [
    {
      provinceId: 1,
      name: 'Sindh',
      cities: [
        {
          cityId: 1,
          name: 'Karachi',
          provinceId: 1,
          suburbs: [
            {
              suburbId: 1,
              name: 'Clifton',
              cityId: 1,
              hospitals: [
                {
                  hospitalId: 1,
                  name: 'Aga Khan University Hospital',
                  address: '',
                  provinceId: 1,
                  cityId: 1,
                  suburbId: 1
                },
                {
                  hospitalId: 2,
                  name: 'South City Hospital',
                  address: '',
                  provinceId: 1,
                  cityId: 1,
                  suburbId: 1
                }
              ]
            },
            {
              suburbId: 2,
              name: 'Gulshan-e-Iqbal',
              cityId: 1,
              hospitals: [
                {
                  hospitalId: 3,
                  name: 'Liaquat National Hospital',
                  address: '',
                  provinceId: 1,
                  cityId: 1,
                  suburbId: 2
                }
              ]
            }
          ]
        }
      ]
    }
  ];


  cities: City[] = [];
  suburbs: Suburb[] = [];
  hospitals: Hospital[] = [];


  currentRolePath: string = '';

  //LIFE CYCLES
  constructor(private fb: FormBuilder, private patientService: PatientService, private router: Router,
    private activeRoute: ActivatedRoute, private notificationService: NzNotificationService, private authService: AuthService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      id: [EMPTY_GUID],
      hospitalNumber: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      dateOfAdmission: [null, Validators.required],
      ageOnAdmission: [null, [Validators.required, strictDecimalValidator()]],
      birthWeight: [null, [Validators.required, strictDecimalValidator()]],
      gestationalUnit: [null],
      gestationalAge: [null, strictDecimalValidator()],
      gender: [null, Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      suburb: ['', Validators.required],
      hospital: ['', Validators.required],
      placeOfBirth: [null, Validators.required],
      modeOfDelivery: [null, Validators.required],
      initialResuscitation: [[]],
      oneMinuteApgar: [null],
      fiveMinuteApgar: [null],
      tenMinuteApgar: [null],
      outcomeStatus: [null, Validators.required],
      transferHospital: [''],
      birthHivPcr: [null, Validators.required],
      headCircumference: [null, [strictDecimalValidator()]],
      footLength: [null, [strictDecimalValidator()]],
      lengthAtBirth: [null, [strictDecimalValidator()]],
      diedInDeliveryRoom: [null, Validators.required],
      diedWithin12Hours: [null, Validators.required],
      initialTemperature: [null, [strictDecimalValidator()]],
      mothersGtNumber: [''],
      dateOfDeath: [null],
      conditionAtBirth: [''],
      syphilisSerology: [''],
      singleOrMultipleBirths: [''],
      obstetricCauseOfDeath: [''],
      neonatalCauseOfDeath: [''],
      avoidableFactors: [''],
    });

    const id = this.activeRoute.parent?.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.patientService.getPatientById(id).subscribe({
        next: (val: Patient) => {
          this.patientForm.patchValue(val);
          this.patient = val;
          if(val){
            this.sharedService.setEditable(false);
          }
          this.loading = false
        },
        error: (err: any) => {
          this.notificationService.error("error", err.message)
          this.loading = false
        },
      });
    }

    this.setCurrentRole();
    this.sharedService.editable$.subscribe(editable => {
      if ((editable || this.patientForm.get('id')!.value === EMPTY_GUID) && !this.isAdmin()) {
        this.patientForm.enable();
      } else {
        this.patientForm.disable();
      }
    })
  }

  //GETTERS
  get outcomeStatus() {
    return this.patientForm.get('outcomeStatus')?.value;
  }

  get diedInDeliveryRoom() {
    return this.patientForm.get('diedInDeliveryRoom')?.value;
  }

  get diedWithin12Hours() {
    return this.patientForm.get('diedWithin12Hours')?.value;
  }

  //UI LOGIC
  setCurrentRole(): void {
    if (this.authService.getRole()?.toLowerCase() === "doctor") {
      this.currentRolePath = this.rolesPath.doctor;
    }
    else if (this.authService.getRole()?.toLowerCase() === "intern") {
      this.currentRolePath = this.rolesPath.intern;
    }
    else if (this.authService.getRole()?.toLowerCase() === 'admin') {
      this.currentRolePath = this.rolesPath.admin;
    }
  }

  disableDate = (date: Date): boolean => date > new Date();
  isAdmin = (): boolean => this.currentRolePath === this.rolesPath.admin;

  markAsComplete(): void {
    if (this.isAdmin()) {
      this.router.navigate([this.currentRolePath, 'patient', this.patient.id, 'maternal'])
      return;
    }

    if (this.patientForm.valid) {
      this.btnLoading = true;
      let formValue = this.patientForm.getRawValue();
      // formValue = this.stripPPIPFieldsIfNotRequired(formValue);
      this.patientService.createPatient(formValue)
        .subscribe({
          next: (res) => {
            this.patientForm.patchValue(res);
            this.patient = res;
            this.sharedService.setEditable(false);
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

  navToNext(){
    this.router.navigate([this.currentRolePath, 'patient', this.patient.id, 'maternal'])
  }

  setEditable(){
    this.sharedService.setEditable(true)
  }

  setPPIPFormRequired(){
    const fields = [
      'mothersGtNumber',
      'dateOfDeath',
      'conditionAtBirth',
      'syphilisSerology',
      'singleOrMultipleBirths',
      'obstetricCauseOfDeath',
      'neonatalCauseOfDeath',
      'avoidableFactors'
    ];
    fields.forEach(field => {
      const control = this.patientForm.get(field);
      if (control) {
        control.enable();
        control.setValidators(Validators.required);
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.patientForm.updateValueAndValidity();
  }

  unsetPPIPFormRequired(){
    const fields = [
      'mothersGtNumber',
      'dateOfDeath',
      'conditionAtBirth',
      'syphilisSerology',
      'singleOrMultipleBirths',
      'obstetricCauseOfDeath',
      'neonatalCauseOfDeath',
      'avoidableFactors'
    ];
    fields.forEach(field => {
      const control = this.patientForm.get(field);
      if (control) {
        control.disable();
        control.clearValidators();
        control.setErrors(null);
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.patientForm.updateValueAndValidity();
  }

  private stripPPIPFieldsIfNotRequired(formValue: any): any {
    if (
      this.outcomeStatus !== 'Died' &&
      !this.diedInDeliveryRoom &&
      !this.diedWithin12Hours
    ) {
      const fieldsToRemove = [
        'mothersGtNumber',
        'dateOfDeath',
        'conditionAtBirth',
        'syphilisSerology',
        'singleOrMultipleBirths',
        'obstetricCauseOfDeath',
        'neonatalCauseOfDeath',
        'avoidableFactors'
      ];
      fieldsToRemove.forEach(field => delete formValue[field]);
    }
    return formValue;
  }

  //NAVIGATIONS
  close(): void {
    this.router.navigate([this.currentRolePath, 'patients'])
  }

  onProvinceChange(provinceName: string): void {
    const province = this.provinces.find(p => p.name === provinceName);
    this.cities = province?.cities || [];
    this.suburbs = [];
    this.hospitals = [];
    this.patientForm.patchValue({ city: null, suburb: null, hospital: null });
  }

  onCityChange(cityName: string): void {
    const city = this.cities.find(c => c.name === cityName);
    this.suburbs = city?.suburbs || [];
    this.hospitals = [];
    this.patientForm.patchValue({ suburb: null, hospital: null });
  }

  onSuburbChange(suburbName: string): void {
    const suburb = this.suburbs.find(s => s.name === suburbName);
    this.hospitals = suburb?.hospitals || [];
    this.patientForm.patchValue({ hospital: null });
  }
}
