import { ReportMonthDto } from "./report-month-dto";
import { ReportYearTotalsDto } from "./report-year-totals-dto";

export interface ReportDto {
    reporttype: string;
    monthlyReports: ReportMonthDto[];
    yearTotals: ReportYearTotalsDto[];
}
