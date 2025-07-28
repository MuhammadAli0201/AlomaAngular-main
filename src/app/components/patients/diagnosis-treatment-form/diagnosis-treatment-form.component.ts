import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DiagnosisTreatmentFormService } from '../../../services/diagnosis-treatment-form.service';
import { PatientCompleteInfo } from '../../../models/patient-complete-info';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EMPTY_GUID } from '../../../constants/constants';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import {
  catchError,
  finalize,
  firstValueFrom,
  forkJoin,
  mergeMap,
  of,
  subscribeOn,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import {
  CongenitalInfectionOrganism,
  CongenitalInfectionOrganismService,
} from '../../../services/congenitalinfectionorganism.service';
import {
  Antimicrobial,
  AntimicrobialService,
} from '../../../services/antimicrobial.service';
import { Organism, OrganismService } from '../../../services/organism.service';
import {
  FungalOrganism,
  FungalOrganismService,
} from '../../../services/fungalorganism.service';
import {
  SonarFinding,
  SonarFindingService,
} from '../../../services/sonarfinding.service';
import { Location } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { LookupService } from '../../../services/lookup.service';
import { LookupItems } from '../../../models/lookup-items';
import { LookupCategoryIds } from '../../../constants/lookup-categories';
import { LookupItemIds } from '../../../constants/lookup-items';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-diagnosis-treatment-form',
  standalone: false,
  templateUrl: './diagnosis-treatment-form.component.html',
  styleUrl: './diagnosis-treatment-form.component.scss',
})
export class DiagnosisTreatmentFormComponent implements OnInit {
  diagnosisForm!: FormGroup;
  btnLoading: boolean = false;
  loading: boolean = false;
  patient!: Patient;
  patientCompleteInfo!: PatientCompleteInfo;
  congenitalOrganisms: CongenitalInfectionOrganism[] = []; //
  bacterialOrganisms: Organism[] = []; //
  sonarFindingsOptions: SonarFinding[] = []; //
  earlyAbxOptions: Antimicrobial[] = []; //
  lateAbxOptions: Antimicrobial[] = [];
  fungalOrganisms: FungalOrganism[] = []; //

  yesNoUnknown: LookupItems[] = [];
  yesNoNaUnknown: LookupItems[] = [];
  locationOptions: LookupItems[] = [];
  sepsisSites: LookupItems[] = [];
  fungalLocationOptions: LookupItems[] = [];
  respDiagnosisOptions: LookupItems[] = [];
  respSupportOptions: LookupItems[] = [];
  ivhGrades: LookupItems[] = [];
  eosRecOptions: LookupItems[] = [];
  hieGradeOptions: LookupItems[] = [];
  aeeGReasonOptions: LookupItems[] = [];
  coolingReasonOptions: LookupItems[] = [];
  coolingTypeOptions: LookupItems[] = [];
  necSurgeryTypeOptions: LookupItems[] = [];
  ropFindingsOptions: LookupItems[] = [];
  kmcTypeOptions: LookupItems[] = [];
  ropSurgeryOptions: LookupItems[] = [];
  metabolicOptions: LookupItems[] = [];
  glucoseAbnOptions: LookupItems[] = [];
  outcomeOptions: LookupItems[] = [];
  feedOptions: LookupItems[] = [];

  rolesPath = {
    admin: 'admin-dashboard',
    intern: 'intern-dashboard',
    doctor: 'doctor-dashboard',
  };

  currentRolePath: string = '';

  constructor(
    private fb: FormBuilder,
    private patientCompleteInfoService: DiagnosisTreatmentFormService,
    private authService: AuthService,
    private location: Location,
    private nzNotificationService: NzNotificationService,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private congenitalInfectionOrganismService: CongenitalInfectionOrganismService,
    private antiMicrobialService: AntimicrobialService,
    private oragnismService: OrganismService,
    private fungalOragnismService: FungalOrganismService,
    private sonarFindingService: SonarFindingService,
    private sharedService: SharedService,
    private lookupService: LookupService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.diagnosisForm = this.fb.group({
       id: [EMPTY_GUID],
      patientId: [EMPTY_GUID],

      neonatalSepsis: [null],
      congenitalInfection: [null],
      congenitalInfectionOrganism: [null],
      specifyOther: [null],
      bacterialSepsisBeforeDay3: [null],
      bsOrganism: [null],
      earlyAntibiotics: [null],
      sepsisAfterDay3: [null],
      sepsisSite: [null],
      bacterialPathogen: [null],
      bacterialInfectionLocation: [null],
      cons: [null],
      consLocation: [null],
      otherBacteria: [null],
      fungalSepsis: [null],
      betaDGlucan: [null],
      fungalSepsisLocation: [null],
      fungalOrganism: [null],
      lateSepsisAbx: [null],
      specifyOtherAbx: [null],
      abxDuration: [null],

      abgAvailable: [null],
      baseExcess: [null],
      cribWeightGa: [null],
      cribTemp: [null],
      cribBaseExcess: [null],
      cribTotal: [null],
      eosCalcDone: [null],
      eosRisk: [null],
      eosRecommendation: [null],
      eosFollowed: [null],

      cranialBefore28: [null],
      ivh: [null],
      worstIvh: [null],
      sonarFindings: [null],
      cysticPvl: [null],
      otherSonarFindings: [null],

      respiratoryDiagnosis: [null],
      pneumoLocation: [null],
      respSupportAfter: [null],
      hfncHighRate: [null],
      hfStart: [null],
      hfEnd: [null],
      ncpapStart: [null],
      ncpapEnd: [null],
      ncpapDuration: [null],
      ncpap2Start: [null],
      ncpap2End: [null],
      ncpap2Duration: [null],
      vent1Start: [null],
      vent1End: [null],
      vent1Duration: [null],
      vent2Start: [null],
      vent2End: [null],
      vent2Duration: [null],
      ncpapNoEtt: [null],
      septalNecrosis: [null],
      ino: [null],
      oxygen28: [null],
      resp28: [null],
      steroidsCld: [null],
      caffeine: [null],
      surfactantInit: [null],
      surfactantAny: [null],
      svtDoses: [null],
      svtFirstHours: [null],
      svtFirstMinutes: [null],

      chd: [null],
      pdaLiti: [null],
      pdaIbuprofen: [null],
      pdaParacetamol: [null],
      inotropicSupport: [null],

      hieSection: [null],
      thomsonScore: [null],
      bloodGasResult: [null],
      hieGradeSection: [null],
      aeeG: [null],
      aeeGNotDoneReason: [null],
      aeeGFindings: [null],
      cerebralCooling: [null],
      coolingNotDoneReason: [null],
      coolingType: [null],

      necEnterocolitis: [null],
      parenteralNutrition: [null],
      necSurgery: [null],
      otherSurgery: [null],
      typeNecSurgery: [null],
      surgeryCode1: [null],
      surgeryCode2: [null],
      surgeryCode3: [null],
      surgeryCode4: [null],

      retinopathyPre: [null],
      ropFindings: [null],
      ropSurgery: [null],

      jaundiceRequirement: [null],
      exchangeTransfusion: [null],
      maxBilirubin: [null],

      bloodTransfusion: [null],
      plateletTransfusion: [null],
      plasmaTransfusion: [null],

      metabolicComplications: [null],
      glucoseAbnormalities: [null],

      majorBirthDefect: [null],
      defectCodes: [null],
      congenitalAnomaly: [null],

      kangarooCare: [null],
      kmcType: [null],
      outcomeSection: [null],
      hospitalName: [null],
      feedsOnDischarge: [null],
      homeOxygen: [null],
      dischargeWeight: [null],
      durationOfStay: [null],
      fileBase64List: this.fb.array([]),
    });
    
    this.loading = true;
    [
      this.yesNoUnknown,
      this.yesNoNaUnknown,
      this.locationOptions,
      this.sepsisSites,
      this.fungalLocationOptions,
      this.respDiagnosisOptions,
      this.respSupportOptions,
      this.ivhGrades,
      this.eosRecOptions,
      this.hieGradeOptions,
      this.aeeGReasonOptions,
      this.coolingReasonOptions,
      this.coolingTypeOptions,
      this.necSurgeryTypeOptions,
      this.ropFindingsOptions,
      this.kmcTypeOptions,
      this.ropSurgeryOptions,
      this.metabolicOptions,
      this.glucoseAbnOptions,
      this.outcomeOptions,
      this.feedOptions,
    ] = await Promise.all([
      this.lookupService.getByCategoryId(LookupCategoryIds.yesNoUnknown),
      this.lookupService.getByCategoryId(LookupCategoryIds.yesNoNaUnknown),
      this.lookupService.getByCategoryId(LookupCategoryIds.locationOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.sepsisSites),
      this.lookupService.getByCategoryId(
        LookupCategoryIds.fungalLocationOptions
      ),
      this.lookupService.getByCategoryId(
        LookupCategoryIds.respDiagnosisOptions
      ),
      this.lookupService.getByCategoryId(LookupCategoryIds.respSupportOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.ivhGrades),
      this.lookupService.getByCategoryId(LookupCategoryIds.eosRecOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.hieGradeOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.aeeGReasonOptions),
      this.lookupService.getByCategoryId(
        LookupCategoryIds.coolingReasonOptions
      ),
      this.lookupService.getByCategoryId(LookupCategoryIds.coolingTypeOptions),
      this.lookupService.getByCategoryId(
        LookupCategoryIds.necSurgeryTypeOptions
      ),
      this.lookupService.getByCategoryId(LookupCategoryIds.ropFindingsOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.kmcTypeOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.ropSurgeryOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.metabolicOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.glucoseAbnOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.outcomeOptions),
      this.lookupService.getByCategoryId(LookupCategoryIds.feedOptions),
    ]);

    const patientId = this.activatedRoute.parent?.snapshot.params['id'];

    if (patientId) {
      this.patientService
        .getPatientById(patientId)
        .pipe(
          tap((res: Patient) => {
            this.patient = res;
            this.diagnosisForm.patchValue({
              patientId: res.id,
            });
          }),
          switchMap((patient: Patient) =>
            this.patientCompleteInfoService.getByPatientId(patient.id!)
          ),
          tap((res: PatientCompleteInfo) => {
            this.setManagedItems(res)
            this.patientCompleteInfo = res;
            this.diagnosisForm.patchValue(res);
            console.log(res.fileBase64List);
            if (res.fileBase64List) {
                res.fileBase64List.forEach((file: any) => {
                  this.filesArray.push(this.fb.control(file));
                });
              }
            if (!res) {
              this.sharedService.setEditable(true);
            }
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          error: (err: Error) => {
            this.nzNotificationService.error('Error', err.message);
          },
        });
    }

    const dropdownCalls = forkJoin({
      congenitalOrganisms: this.congenitalInfectionOrganismService.getAll(),
      earlyAndLateAbx: this.antiMicrobialService.getAll(),
      bacterialOrganisms: this.oragnismService.getAll(),
      fungalOrganisms: this.fungalOragnismService.getAll(),
      sonarFindingsOptions: this.sonarFindingService.getAll(),
    });

    dropdownCalls.pipe(tap((res: any) => (this.loading = true))).subscribe({
      next: (res: any) => {
        this.congenitalOrganisms = res.congenitalOrganisms;
        this.earlyAbxOptions = res.earlyAndLateAbx;
        this.lateAbxOptions = res.earlyAndLateAbx;
        this.bacterialOrganisms = res.bacterialOrganisms;
        this.fungalOrganisms = res.fungalOrganisms;
        this.sonarFindingsOptions = res.sonarFindingsOptions;
        this.loading = false;
      },
    });

    this.setCurrentRole();
    this.sharedService.editable$.subscribe((editable) => {
      if (editable && !this.isAdmin()) {
        this.diagnosisForm.enable();
      } else {
        this.diagnosisForm.disable();
      }
    });
  }

  get filesArray(): FormArray {
    return this.diagnosisForm.get('fileBase64List') as FormArray;
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): boolean => {
    const rawFile = file as any as File; // Cast to real File object

    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.filesArray.push(this.fb.control(base64));
      for(let c of this.filesArray.controls){
        console.log(c.value)
      }
    };

    return false; // Prevent automatic upload
  };

  async setManagedItems(patientCompleteInfo: PatientCompleteInfo){
    if(patientCompleteInfo.bsOrganism)
    for(let b of patientCompleteInfo.bsOrganism){
      let response = await firstValueFrom(this.oragnismService.getById(parseInt(b)))
      this.bacterialOrganisms.push(response);
    }
    if(patientCompleteInfo.fungalOrganism)
    for(let f of patientCompleteInfo.fungalOrganism){
      let response = await firstValueFrom(this.fungalOragnismService.getById(parseInt(f)))
      this.fungalOrganisms.push(response);
    }
    if(patientCompleteInfo.earlyAntibiotics){
      let response = await firstValueFrom(this.antiMicrobialService.getById(parseInt(patientCompleteInfo.earlyAntibiotics)))
      this.earlyAbxOptions.push(response);
    }
    if(patientCompleteInfo.congenitalInfectionOrganism)
    for(let c of patientCompleteInfo.congenitalInfectionOrganism){
      let response = await firstValueFrom(this.congenitalInfectionOrganismService.getById(parseInt(c)))
      this.congenitalOrganisms.push(response);
    }
    if(patientCompleteInfo.sonarFindings)
    for(let s of patientCompleteInfo.sonarFindings){
      let response = await firstValueFrom(this.sonarFindingService.getById(parseInt(s)))
      this.sonarFindingsOptions.push(response);
    }
  }

  //UI LOGIC
  isCongentialInfection(): boolean{
    return this.diagnosisForm.get('congenitalInfection')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isBacterialSepsisBeforeDay3(): boolean {
    return this.diagnosisForm.get('bacterialSepsisBeforeDay3')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isSepsisAfterDay3(): boolean {
    return this.diagnosisForm.get('sepsisAfterDay3')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isBacterialPathogen(): boolean {
    return this.diagnosisForm.get('bacterialPathogen')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isCons(): boolean {
    return this.diagnosisForm.get('cons')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isFungalSepsis(): boolean {
    return this.diagnosisForm.get('fungalSepsis')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isAbgAvailable(): boolean {
    return this.diagnosisForm.get('abgAvailable')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isEosCalcDone(): boolean {
    return this.diagnosisForm.get('eosCalcDone')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isIvh(): boolean {
    return this.diagnosisForm.get('ivh')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isWorstIvh(): boolean {
    return this.diagnosisForm.get('ivh')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isPdaLiti(): boolean {
    return this.diagnosisForm.get('pdaLiti')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isAeeG(): boolean {
    return this.diagnosisForm.get('aeeG')?.value === LookupItemIds.yesNoUnknown.No;
  }

  isCerebralCoolingNo(): boolean {
    return this.diagnosisForm.get('cerebralCooling')?.value === LookupItemIds.yesNoUnknown.No;
  }

  isCerebralCoolingYes(): boolean {
    return this.diagnosisForm.get('cerebralCooling')?.value === LookupItemIds.yesNoUnknown.Yes;
  }
  
  isCranialBefore28() : boolean {
    return this.diagnosisForm.get('cranialBefore28')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isHieSection():boolean{
   return this.diagnosisForm.get('hieSection')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isNecSurgery(): boolean {
    return this.diagnosisForm.get('necSurgery')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isRetinopathyPre(): boolean {
    return this.diagnosisForm.get('retinopathyPre')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isKangarooCare(): boolean {
    return this.diagnosisForm.get('kangarooCare')?.value === LookupItemIds.yesNoUnknown.Yes;
  }

  isOutcomeHospital(): boolean {
    const val = this.diagnosisForm.get('outcomeSection')?.value;
    return Array.isArray(val) && val.includes('Hospital');
  }

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

  markAsComplete(): void {
    debugger;
    if (this.diagnosisForm.valid) {
      this.btnLoading = true;
      this.patientCompleteInfoService
        .createOrUpdate(this.diagnosisForm.getRawValue())
        .subscribe({
          next: (res: PatientCompleteInfo) => {
            this.patientCompleteInfo = res;
            this.diagnosisForm.patchValue(res);
            this.sharedService.setEditable(false);
            this.nzNotificationService.success(
              'Success',
              'Patient Form has been saved successfully'
            );
            this.btnLoading = false;
          },
          error: (err: Error) => {
            this.nzNotificationService.error('Error', err.message);
            this.btnLoading = false;
          },
        });
    } else {
      this.diagnosisForm.markAllAsTouched();
    }
  }

  setEditable() {
    this.sharedService.setEditable(true);
  }

  //NAVIGATIONS
  back() {
    this.location.back();
  }

  close(): void {
    this.router.navigate([this.currentRolePath, 'patients']);
  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });