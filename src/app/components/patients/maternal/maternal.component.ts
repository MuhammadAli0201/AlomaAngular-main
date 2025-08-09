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
import { Location } from '@angular/common';
import { strictDecimalValidator } from '../../../validators/strict-decimal';
import { SharedService } from '../../../services/shared.service';
import { CONSTANTS } from '../../../constants';

@Component({
  selector: 'app-maternal',
  standalone: false,
  templateUrl: './maternal.component.html',
  styleUrl: './maternal.component.scss',
})
export class MaternalComponent implements OnInit {
  patient!: Patient;
  maternal!: Maternal;
  motherForm!: FormGroup;
  loading: boolean = false;
  btnLoading: boolean = false;
  isVerify: boolean = false;

  yesNoUnknown = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: 'Unknown' },
  ];

  yesNoNaUnknown = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'N/A', value: 'N/A' },
    { label: 'Unknown', value: 'Unknown' },
  ];

  raceOptions = [
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Coloured', value: 'Coloured' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' },
  ];

  multipleGestationOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  rolesPath = {
    admin: 'admin-dashboard',
    intern: 'intern-dashboard',
    doctor: 'doctor-dashboard',
  };

  currentRolePath: string = '';

  //LIFE CYCLES
  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private patientService: PatientService,
    private maternalService: MaternalService,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.motherForm = this.fb.group({
      id: [EMPTY_GUID],
      patientId: [EMPTY_GUID],
      hospitalNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      age: [null, [Validators.required, strictDecimalValidator()]],
      race: ['', [Validators.required]],
      parity: [''],
      gravidity: [''],
      antenatalCare: [''],
      antenatalSteroid: [''],
      antenatalMgSulfate: [''],
      chorioamnionitis: [''],
      hypertension: [''],
      maternalHiv: [''],
      hivProphylaxis: [''],
      haartBegun: [''],
      syphilis: [''],
      syphilisTreated: [''],
      diabetes: [''],
      tb: [''],
      tbTreatment: [''],
      teenageMother: [''],
      abandonedBaby: [''],
      neonatalAbstinence: [''],
      otherInfo: [''],
      multipleGestations: [''],
      numberOfBabies: [null, [strictDecimalValidator()]],
    });

    const id = this.activatedRoute.parent?.snapshot.params['id'];
    if (id) {
      this.loading = true;
      this.patientService
        .getPatientById(id)
        .pipe(
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
            if (!maternal) {
              this.sharedService.setEditable(true);
            }
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          error: (err: Error) => {
            this.notificationService.error('Error', err.message);
          },
        });
      const param = this.activatedRoute.snapshot.queryParams['verify'];
      if (param) {
        this.isVerify = param;
      }
    }

    this.setCurrentRole();
    this.sharedService.editable$.subscribe((editable) => {
      if (editable && !this.isAdmin()) {
        this.motherForm.enable();
      } else {
        this.motherForm.disable();
      }
    });
  }

  //UI LOGIC
  setCurrentRole(): void {
    if (this.authService.getRole()?.toLowerCase() === 'doctor') {
      this.currentRolePath = this.rolesPath.doctor;
    } else if (this.authService.getRole()?.toLowerCase() === 'intern') {
      this.currentRolePath = this.rolesPath.intern;
    } else if (this.authService.getRole()?.toLowerCase() === 'admin') {
      this.currentRolePath = this.rolesPath.admin;
    }
  }
  isAdmin = (): boolean => this.currentRolePath === this.rolesPath.admin;
  isDoctor = (): boolean => this.currentRolePath === this.rolesPath.doctor;

  markedAsCompleted(): boolean {
    return this.patient?.markAsCompletedId === CONSTANTS.markAsComplete.pending && !this.isDoctor();
  }

  markAsComplete(): void {
    if (this.motherForm.valid) {
      this.btnLoading = true;
      this.maternalService
        .createOrUpdateMaternal(this.motherForm.getRawValue())
        .subscribe({
          next: (res) => {
            this.motherForm.patchValue(res);
            this.sharedService.setEditable(false);
            this.btnLoading = false;
          },
          error: (err) => {
            this.notificationService.error('Error', err.message),
              (this.btnLoading = false);
          },
        });
    } else {
      this.motherForm.markAllAsTouched();
      this.btnLoading = false;
    }
  }

  setEditable() {
    this.sharedService.setEditable(true);
  }

  navToNext() {
    setTimeout(() => {
      this.router.navigate(
        [this.currentRolePath, 'patient', this.patient.id, 'full'],
        { queryParams: { verify: this.isVerify } }
      );
    }, 0);
  }

  //NAVIGATION
  back() {
    this.location.back();
  }

  close(): void {
    this.router.navigate([this.currentRolePath, 'patients']);
  }
}
