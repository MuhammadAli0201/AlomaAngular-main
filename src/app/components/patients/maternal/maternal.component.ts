import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaternalService } from '../../../services/maternal.service';
import { Maternal } from '../../../models/maternal';
import { tap, switchMap, finalize } from 'rxjs';
import { EMPTY_GUID } from '../../../constants/constants';
import { AuthService } from '../../../services/auth.service';
import { strictDecimalValidator } from '../../../validators/strict-decimal';

@Component({
  selector: 'app-maternal',
  standalone: false,
  templateUrl: './maternal.component.html',
  styleUrl: './maternal.component.scss'
})
export class MaternalComponent implements OnInit {
  patient!: Patient;
  maternal!: Maternal;
  motherForm!: FormGroup;
  loading: boolean = false;
  btnLoading: boolean = false;

  yesNoUnknown = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: 'Unknown' }
  ];

  yesNoNaUnknown = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'N/A', value: 'N/A' },
    { label: 'Unknown', value: 'Unknown' }
  ];

  raceOptions = [
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Coloured', value: 'Coloured' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' }
  ];

  multipleGestationOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];

  //LIFE CYCLES
  constructor(private activatedRoute: ActivatedRoute, private notificationService: NzNotificationService,
    private fb: FormBuilder, private patientService: PatientService, private maternalService: MaternalService,
    private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.motherForm = this.fb.group({
      id: [EMPTY_GUID],
      patientId: [EMPTY_GUID],
      hospitalNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      age: [null, [Validators.required, strictDecimalValidator()]],
      race: [null, [Validators.required]],
      parity: [''],
      gravidity: [''],
      initialDiagnosis: [null],
      antenatalCare: [null],
      antenatalSteroid: [null],
      antenatalMgSulfate: [null],
      chorioamnionitis: [null],
      hypertension: [null],
      maternalHiv: [null],
      hivProphylaxis: [null],
      haartBegun: [null],
      syphilis: [null],
      syphilisTreated: [null],
      diabetes: [null],
      tb: [null],
      tbTreatment: [null],
      teenageMother: [null],
      abandonedBaby: [null],
      neonatalAbstinence: [null],
      otherInfo: [''],
      multipleGestations: [null],
      numberOfBabies: [null, [strictDecimalValidator()]]
    });

    const id = this.activatedRoute.parent?.snapshot.params["id"];
    if (id) {
      this.loading = true;
      this.patientService.getPatientById(id).pipe(
        tap((patient: Patient) => {
          this.patient = patient;
          this.motherForm.patchValue({ patientId: patient.id });
        }),
        switchMap((patient: Patient) =>
          this.maternalService.getMaternalByPatientId(patient.id!)
        ),
        tap((maternal: Maternal) => {
          this.motherForm.patchValue(maternal);
          this.maternal = maternal;
        }),
        finalize(() => this.loading = false)
      ).subscribe({
        error: (err: Error) => {
          this.notificationService.error("Error", err.message);
        }
      });
    }

  }

  onSubmit(): void {
    if (this.motherForm.valid) {
      this.btnLoading = true;
      this.maternalService.createOrUpdateMaternal(this.motherForm.getRawValue()).subscribe({
        next: res => {
          this.motherForm.patchValue(res),
            this.btnLoading = false;
          if (this.authService.getRole()?.toLowerCase() === "doctor") {
            this.router.navigate(["doctor-dashboard", "patient", this.patient.id, "full"]);
          }
          else {
            this.router.navigate(["intern-dashboard", "patient", this.patient.id, "full"]);
          }
        },
        error: err => {
          this.notificationService.error('Error', err.message),
            this.btnLoading = false;
        }
      });
    } else {
      this.motherForm.markAllAsTouched();
      this.btnLoading = false;
    }
  }
}
