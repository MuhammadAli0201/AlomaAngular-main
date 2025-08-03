import { ReportRecordDto } from "./report-record-dto";

export interface ReportMonthDto {
    reportMonthAndYear: Date;
    reportRecords: ReportRecordDto[]
}
