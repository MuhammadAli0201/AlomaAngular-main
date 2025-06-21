import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientCompleteInfoService } from '../../../services/patient-complete-info.service';
import { PatientCompleteInfo } from '../../../models/patient-complete-info';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EMPTY_GUID } from '../../../constants/constants';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../services/patient.service';
import { finalize, mergeMap, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-full-form',
  standalone: false,
  templateUrl: './patient-full-form.component.html',
  styleUrl: './patient-full-form.component.scss'
})
export class PatientFullFormComponent implements OnInit {
  diagnosisForm!: FormGroup;
  btnLoading: boolean = false;
  loading: boolean = false;
  patient!: Patient;
  patientCompleteInfo!: PatientCompleteInfo;

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

  locationOptions = [
    { label: 'CMJAH', value: 'CMJAH' },
    { label: 'Other Hospital', value: 'OtherHospital' },
    { label: 'Both', value: 'Both' }
  ];
  congenitalOrganisms = [
    { label: 'Toxoplasmosis', value: 'Toxoplasmosis' },
    { label: 'Rubella', value: 'Rubella' },
    { label: 'Syphilis', value: 'Syphilis' },
    { label: 'CMV', value: 'CMV' },
    { label: 'Herpes Simplex', value: 'HerpesSimplex' },
    { label: 'Parvovirus B19', value: 'ParvovirusB19' },
    { label: 'Zika Virus', value: 'ZikaVirus' },
    { label: 'Varicella Zoster', value: 'VaricellaZoster' },
    { label: 'Listeria monocytogenes', value: 'Listeria' },
    { label: 'Other', value: 'Other' }
  ];
  bacterialOrganisms = [
    { label: 'Group B Streptococcus', value: 'GBS' },
    { label: 'Staphylococcus Aureus', value: 'StaphAureus' },
    { label: 'MRSA', value: 'MRSA' },
    { label: 'Staphylococcus Epidermidis/CONS', value: 'CONS' },
    { label: 'Streptococcus Viridans', value: 'Viridans' },
    { label: 'Escherichia Coli', value: 'EColi' },
    { label: 'Klebsiella pneumonia', value: 'Klebsiella' },
    { label: 'ESBL Klebsiella', value: 'ESBL' },
    { label: 'Enterococcus faecalis', value: 'EFaecalis' },
    { label: 'Enterococcus faecium', value: 'EFaecium' },
    { label: 'Acinetobacter spp.', value: 'Acinetobacter' },
    { label: 'Pseudomonas spp.', value: 'Pseudomonas' },
    { label: 'Stenotrophomonas spp.', value: 'Stenotrophomonas' },
    { label: 'Listeria spp.', value: 'ListeriaSpp' },
    { label: 'Burkholderia spp.', value: 'Burkholderia' },
    { label: 'Serratia marcescens', value: 'Serratia' },
    { label: 'Campylobacter spp.', value: 'Campylobacter' },
    { label: 'Citrobacter spp.', value: 'Citrobacter' },
    { label: 'Enterobacter spp.', value: 'Enterobacter' },
    { label: 'Carbapenem resistant enterobacter', value: 'CRE' },
    { label: 'Moraxella spp.', value: 'Moraxella' },
    { label: 'Neisseria spp.', value: 'Neisseria' },
    { label: 'Haemophilus spp.', value: 'Haemophilus' },
    { label: 'Other', value: 'Other' }
  ];
  earlyAbxOptions = [
    { label: 'None', value: 'None' },
    { label: 'Yes – empiric only', value: 'EmpiricOnly' },
    { label: 'Yes – directed only', value: 'DirectedOnly' },
    { label: 'Yes – empiric & directed', value: 'Both' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  sepsisSites = [
    { label: 'Blood', value: 'Blood' },
    { label: 'Urine', value: 'Urine' },
    { label: 'Skin', value: 'Skin' },
    { label: 'Wound', value: 'Wound' },
    { label: 'Eye', value: 'Eye' },
    { label: 'Meningitis', value: 'Meningitis' },
    { label: 'Arthritis', value: 'Arthritis' },
    { label: 'Pneumonia', value: 'Pneumonia' },
    { label: 'Endocarditis', value: 'Endocarditis' }
  ];
  fungalLocationOptions = [
    { label: 'Base hospital', value: 'Base' },
    { label: 'Other hospital', value: 'OtherHospital' },
    { label: 'Both', value: 'Both' }
  ];
  fungalOrganisms = [
    { label: 'Candida Albicans', value: 'CandidaAlbicans' },
    { label: 'Candida auris', value: 'CandidaAuris' },
    { label: 'Non albicans candida', value: 'NonAlbicans' },
    { label: 'Other', value: 'Other' }
  ];
  lateAbxOptions = [
    { label: 'Ampicillin', value: 'Ampicillin' },
    { label: 'Gentamicin', value: 'Gentamicin' },
    { label: 'Meropenem', value: 'Meropenem' },
    { label: 'Vancomycin', value: 'Vancomycin' },
    { label: 'Colistin', value: 'Colistin' },
    { label: 'Amikacin', value: 'Amikacin' },
    { label: 'Tazocin', value: 'Tazocin' },
    { label: 'Trimethoprim Sulphamethoxazole', value: 'TMP_SMZ' },
    { label: 'Azithromycin', value: 'Azithromycin' },
    { label: 'Amphotericin', value: 'Amphotericin' },
    { label: 'Nystatin', value: 'Nystatin' },
    { label: 'Micafungin', value: 'Micafungin' },
    { label: 'Fluconazole', value: 'Fluconazole' },
    { label: 'Other', value: 'Other' }
  ];
  respDiagnosisOptions = [
    { label: 'Transient tachypnoea of the newborn', value: 'TTN' },
    { label: 'Congenital pneumonia', value: 'CongPneum' },
    { label: 'Meconium aspiration syndrome', value: 'MAS' },
    { label: 'Birth asphyxia', value: 'Asphyxia' },
    { label: 'Pneumothorax', value: 'Pneumothorax' },
    { label: 'Acquired pneumonia', value: 'AcqPneum' },
    { label: 'Pulmonary haemorrhage', value: 'Hemorrhage' },
    { label: 'PPHN', value: 'PPHN' },
    { label: 'Atelectasis', value: 'Atelectasis' },
    { label: 'HMD/RDS', value: 'RDS' },
    { label: 'BPD/CLD', value: 'BPD' }
  ];
  respSupportOptions = [
    { label: 'Oxygen', value: 'Oxygen' },
    { label: 'NCPAP', value: 'NCPAP' },
    { label: 'Conventional ventilation', value: 'Conventional' },
    { label: 'High frequency ventilation', value: 'HFV' },
    { label: 'Nasal IMV/SIMV', value: 'IMV' },
    { label: 'High flow cannula', value: 'HFNC' },
    { label: 'Unknown', value: 'Unknown' }
  ];
  ivhGrades = [
    { label: 'None', value: 'None' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' }
  ];
  sonarFindingsOptions = [
    { label: 'No Abnormality Detected', value: 'None' },
    { label: 'PVL', value: 'PVL' },
    { label: 'Cerebral Oedema', value: 'Oedema' },
    { label: 'Ventricular Dilation', value: 'Dilation' },
    { label: 'Intracerebral bleed', value: 'Bleed' },
    { label: 'Hydrocephalus', value: 'Hydrocephalus' },
    { label: 'Subdural Haemorrhage', value: 'Subdural' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Grade 1', value: 'Grade1' },
    { label: 'Grade 2', value: 'Grade2' },
    { label: 'Grade 3', value: 'Grade3' },
    { label: 'Grade 4', value: 'Grade4' },
    { label: 'Other', value: 'Other' },
    { label: 'Not Known', value: 'NotKnown' }
  ];
  eosRecOptions = [
    { label: 'No culture, No Antibiotics', value: 'NoCulture' },
    { label: 'Strong Consider Empiric Antibiotics', value: 'StrongEmpiric' },
    { label: 'Blood Culture', value: 'BloodCulture' },
    { label: 'Empiric Antibiotics', value: 'Empiric' }
  ];
  hieGradeOptions = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' }
  ];

  aeeGReasonOptions = [
    { label: 'Machine unavailable', value: 'MachineUnavailable' },
    { label: 'Patient unstable', value: 'PatientUnstable' },
    { label: 'Parental refusal', value: 'ParentalRefusal' },
    { label: 'Other', value: 'Other' }
  ];

  coolingReasonOptions = [
    { label: 'Not indicated', value: 'NotIndicated' },
    { label: 'Medical contraindication', value: 'Contraindication' },
    { label: 'Equipment failure', value: 'EquipmentFailure' },
    { label: 'Parental refusal', value: 'ParentalRefusal' },
    { label: 'Other', value: 'Other' }
  ];

  coolingTypeOptions = [
    { label: 'Whole‑body cooling', value: 'WholeBody' },
    { label: 'Selective head cooling', value: 'HeadCooling' },
    { label: 'Other', value: 'Other' }
  ];

  necSurgeryTypeOptions = [
    { label: 'Resection', value: 'Resection' },
    { label: 'Stoma formation', value: 'Stoma' },
    { label: 'Peritoneal drainage', value: 'Drainage' },
    { label: 'Other', value: 'Other' }
  ];

  ropFindingsOptions = [
    { label: 'Stage 1', value: 'Stage1' },
    { label: 'Stage 2', value: 'Stage2' },
    { label: 'Stage 3', value: 'Stage3' },
    { label: 'Plus disease', value: 'PlusDisease' },
    { label: 'Other', value: 'Other' }
  ];

  kmcTypeOptions = [
    { label: 'Skin‑to‑skin contact', value: 'SkinToSkin' },
    { label: 'Breastfeeding support', value: 'Breastfeeding' },
    { label: 'Thermal regulation', value: 'ThermalRegulation' },
    { label: 'Parent education', value: 'ParentEducation' },
    { label: 'Other', value: 'Other' }
  ];

  ropSurgeryOptions = [
    { label: 'Laser therapy', value: 'Laser' },
    { label: 'Anti‑VEGF injection', value: 'AntiVEGF' },
    { label: 'Vitrectomy', value: 'Vitrectomy' },
    { label: 'Other', value: 'Other' }
  ];

  metabolicOptions = [
    { label: 'Hypoglycemia', value: 'Hypoglycemia' },
    { label: 'Hyperglycemia', value: 'Hyperglycemia' },
    { label: 'Electrolyte imbalance', value: 'Electrolyte' }
  ];

  glucoseAbnOptions = [
    { label: 'Hypoglycemia', value: 'Hypoglycemia' },
    { label: 'Hyperglycemia', value: 'Hyperglycemia' }
  ];

  outcomeOptions = [
    { label: 'Home', value: 'Home' },
    { label: 'Transfer to hospital', value: 'Transfer' },
    { label: 'Death', value: 'Death' }
  ];

  feedOptions = [
    { label: 'Breast milk', value: 'Breast' },
    { label: 'Formula', value: 'Formula' },
    { label: 'Breastmilk and formula', value: 'Mixed' }
  ];

  constructor(private fb: FormBuilder, private patientCompleteInfoService: PatientCompleteInfoService, private authService:AuthService,
    private nzNotificationService: NzNotificationService, private activatedRoute: ActivatedRoute, private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.diagnosisForm = this.fb.group({
      id: [EMPTY_GUID],
      patientId: [EMPTY_GUID],
      neonatalSepsis: [''],
      congenitalInfection: [null],
      congenitalInfectionOrganism: [[]],
      specifyOther: [''],
      bacterialSepsisBeforeDay3: [null],
      bsOrganism: [[]],
      earlyAntibiotics: [null],
      sepsisAfterDay3: [null],
      sepsisSite: [[]],
      bacterialPathogen: [null],
      bacterialInfectionLocation: [null],
      cons: [null],
      consLocation: [null],
      otherBacteria: [''],
      fungalSepsis: [null],
      betaDGlucan: [null],
      fungalSepsisLocation: [null],
      fungalOrganism: [[]],
      lateSepsisAbx: [[]],
      specifyOtherAbx: [''],
      abxDuration: [''],

      abgAvailable: [null],
      baseExcess: [''],
      cribWeightGa: [''],
      cribTemp: [''],
      cribBaseExcess: [''],
      cribTotal: [''],
      eosCalcDone: [null],
      eosRisk: [''],
      eosRecommendation: [null],
      eosFollowed: [null],

      cranialBefore28: [null],
      ivh: [null],
      worstIvh: [null],
      sonarFindings: [[]],
      cysticPvl: [null],
      otherSonarFindings: [''],

      respiratoryDiagnosis: [[]],
      pneumoLocation: [null],
      respSupportAfter: [[]],
      hfncHighRate: [null],
      hfStart: [''],
      hfEnd: [''],
      ncpapStart: [''],
      ncpapEnd: [''],
      ncpapDuration: [''],
      ncpap2Start: [''],
      ncpap2End: [''],
      ncpap2Duration: [''],
      vent1Start: [''],
      vent1End: [''],
      vent1Duration: [''],
      vent2Start: [''],
      vent2End: [''],
      vent2Duration: [''],
      ncpapNoEtt: [null],
      septalNecrosis: [null],
      ino: [null],
      oxygen28: [null],
      resp28: [null],
      steroidsCld: [null],
      caffeine: [null],
      surfactantInit: [null],
      surfactantAny: [null],
      svtDoses: [''],
      svtFirstHours: [''],
      svtFirstMinutes: [''],

      chd: [''],
      pdaLiti: [null],
      pdaIbuprofen: [null],
      pdaParacetamol: [null],
      inotropicSupport: [null],

      hieSection: [null],
      thomsonScore: [''],
      bloodGasResult: [''],
      hieGradeSection: [null],
      aeeG: [null],
      aeeGNotDoneReason: [[]],
      aeeGFindings: [''],
      cerebralCooling: [null],
      coolingNotDoneReason: [[]],
      coolingType: [[]],

      necEnterocolitis: [null],
      parenteralNutrition: [null],
      necSurgery: [null],
      otherSurgery: [null],
      typeNecSurgery: [[]],
      surgeryCode1: [''],
      surgeryCode2: [''],
      surgeryCode3: [''],
      surgeryCode4: [''],

      retinopathyPre: [null],
      ropFindings: [[]],
      ropSurgery: [[]],

      jaundiceRequirement: [null],
      exchangeTransfusion: [null],
      maxBilirubin: [''],

      bloodTransfusion: [null],
      plateletTransfusion: [null],
      plasmaTransfusion: [null],

      metabolicComplications: [[]],
      glucoseAbnormalities: [[]],

      majorBirthDefect: [null],
      defectCodes: [''],
      congenitalAnomaly: [''],

      kangarooCare: [null],
      kmcType: [[]],

      outcomeSection: [[]],
      hospitalName: [''],
      feedsOnDischarge: [[]],
      homeOxygen: [''],
      dischargeWeight: [''],
      durationOfStay: ['']
    });

    const patientId = this.activatedRoute.parent?.snapshot.params['id'];

    if (patientId) {
      this.patientService.getPatientById(patientId)
        .pipe(
          tap((res: Patient) => {
            this.patient = res;
            this.diagnosisForm.patchValue({
              patientId: res.id
            });
          }),
          switchMap((patient: Patient) => this.patientCompleteInfoService.getByPatientId(patient.id!)),
          tap((res: PatientCompleteInfo) => {
            this.patientCompleteInfo = res;
            this.diagnosisForm.patchValue(res)
          }),
          finalize(() => this.loading = false)
        )
        .subscribe({});
    }
  }

  //UI LOGIC
    isAdmin = (): boolean => this.authService.getRole()?.toLowerCase() === 'admin';

  onSubmit(): void {
    if (this.diagnosisForm.valid) {
      this.btnLoading = true;
      this.patientCompleteInfoService.createOrUpdate(this.diagnosisForm.getRawValue()).subscribe({
        next: (res: PatientCompleteInfo) => {
          this.patientCompleteInfo = res;
          this.diagnosisForm.patchValue(res);
          this.nzNotificationService.success("Success", "Patient Form has been saved successfully");
          this.btnLoading = false;
        },
        error: (err: Error) => {
          this.nzNotificationService.error("Error", err.message)
          this.btnLoading = false;
        }
      });
    } else {
      this.diagnosisForm.markAllAsTouched();
    }
  }
}
