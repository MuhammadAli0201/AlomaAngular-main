import { MonthlyMortalityRecordDto } from "./monthly-mortality-record-dto";
import { YearlyMortalityReportDto } from "./yearly-mortality-report-dto";

export interface MortalityReportDto {
    monthlyRecords: MonthlyMortalityRecordDto[];
    yearlyReport: YearlyMortalityReportDto
}
