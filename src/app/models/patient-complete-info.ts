export interface PatientCompleteInfo {
    id: string;
    patientId: string;

    neonatalSepsis: string;
    congenitalInfection: string;
    congenitalInfectionOrganism: string[];
    specifyOther: string;

    bacterialSepsisBeforeDay3: string;
    bsOrganism: string[];
    earlyAntibiotics: string;

    sepsisAfterDay3: string;
    sepsisSite: string[];
    bacterialPathogen: string;
    bacterialInfectionLocation: string;

    cons: string;
    consLocation: string;
    otherBacteria: string;

    fungalSepsis: string;
    betaDGlucan: string;
    fungalSepsisLocation: string;
    fungalOrganism: string[];

    lateSepsisAbx: string[];
    specifyOtherAbx: string;
    abxDuration: string;

    abgAvailable: string;
    baseExcess: string;
    cribWeightGa: string;
    cribTemp: string;
    cribBaseExcess: string;
    cribTotal: string;
    eosCalcDone: string;
    eosRisk: string;
    eosRecommendation: string;
    eosFollowed: string;

    cranialBefore28: string;
    ivh: string;
    worstIvh: string;
    sonarFindings: string[];
    cysticPvl: string;
    otherSonarFindings: string;

    respiratoryDiagnosis: string[];
    pneumoLocation: string;
    respSupportAfter: string[];
    hfncHighRate: string;
    hfStart: string;
    hfEnd: string;
    ncpapStart: string;
    ncpapEnd: string;
    ncpapDuration: string;
    ncpap2Start: string;
    ncpap2End: string;
    ncpap2Duration: string;
    vent1Start: string;
    vent1End: string;
    vent1Duration: string;
    vent2Start: string;
    vent2End: string;
    vent2Duration: string;

    ncpapNoEtt: string;
    septalNecrosis: string;
    ino: string;
    oxygen28: string;
    resp28: string;
    steroidsCld: string;
    caffeine: string;
    surfactantInit: string;
    surfactantAny: string;
    svtDoses: string;
    svtFirstHours: string;
    svtFirstMinutes: string;

    chd: string;
    pdaLiti: string;
    pdaIbuprofen: string;
    pdaParacetamol: string;
    inotropicSupport: string;

    hieSection: string;
    thomsonScore: string;
    bloodGasResult: string;
    hieGradeSection: string;
    aeeG: string;
    aeeGNotDoneReason: string[];
    aeeGFindings: string;
    cerebralCooling: string;
    coolingNotDoneReason: string[];
    coolingType: string[];

    necEnterocolitis: string;
    parenteralNutrition: string;
    necSurgery: string;
    otherSurgery: string;
    typeNecSurgery: string[];
    surgeryCode1: string;
    surgeryCode2: string;
    surgeryCode3: string;
    surgeryCode4: string;

    retinopathyPre: string;
    ropFindings: string[];
    ropSurgery: string[];

    jaundiceRequirement: string;
    exchangeTransfusion: string;
    maxBilirubin: string;

    bloodTransfusion: string;
    plateletTransfusion: string;
    plasmaTransfusion: string;

    metabolicComplications: string[];
    glucoseAbnormalities: string[];

    majorBirthDefect: string;
    defectCodes: string;
    congenitalAnomaly: string;

    kangarooCare: string;
    kmcType: string[];

    outcomeSection: string[];
    hospitalName: string;
    feedsOnDischarge: string[];
    homeOxygen: string;
    dischargeWeight: string;
    durationOfStay: string;
}
