import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report-dto';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ColumnItem } from '../../models/column-item';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LookupService } from '../../services/lookup.service';
import { OrganismService } from '../../services/organism.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-category-report',
  standalone: false,
  templateUrl: './category-report.component.html',
  styleUrl: './category-report.component.scss'
})
export class CategoryReportComponent{
  reportType!: string;
  report: ReportDto | undefined;
  currentDate = new Date();
  currentUser: User | undefined;
  reportTitle: string = '';
  totalsTitle: string = '';
  listOfColumns: ColumnItem[] = []
  dateMonthsRange: Date[] = []
  listOfCategories: string[] = []
  categoryFilterValue: string = ''
  outcomeOptionsId: string = '0E50994E-5EEE-42FD-9798-C8FA9B313225';


  constructor(private route: ActivatedRoute, private router: Router,
    private reportService: ReportService,
    private authService: AuthService,
    private lookupService: LookupService,
    private organismService: OrganismService
  ){
    this.route.params.subscribe(params => {
      this.reportType = params['type'];
      this.listOfCategories = [];
      this.setupReport();
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
  }
  async setupReport(){
    this.fetchReports()
  }

  async fetchReports(){
    this.dateMonthsRange = this.dateMonthsRange.sort((a, b) => a.getTime() - b.getTime());
    if(this.reportType === 'outcome'){
      this.reportTitle = 'PATIENT OUTCOME REPORT'
      this.totalsTitle = 'OUTCOME RATE TOTALS FOR THE YEAR'
      this.listOfColumns = [
        {
          name: 'OUTCOME',
          key: 'category'
        },
        {
          name: 'CASES',
          key: 'cases'
        },
        {
          name: 'ADMISSIONS',
          key: 'admissions'
        },
        {
          name: 'OUTCOME RATE(%)',
          key: 'outcomeRate',
          formatter: (value: any)=> value ? `${value.toFixed(2)}%` : value !== undefined ? '0%' : ''
        }
      ];
      if(this.listOfCategories.length === 0){
        this.listOfCategories = (await this.lookupService.getByCategoryId(this.outcomeOptionsId))
          .map(item => item.name);
      }
      this.report = await this.reportService.getOutcomeReport(
        this.dateMonthsRange,
        this.categoryFilterValue
      )
    }
    else if(this.reportType === 'sepsis'){
      this.reportTitle = 'RATE OF SEPSIS REPORT'
      this.totalsTitle = 'GRAND TOTAL'
      this.listOfColumns = [
        {
          name: 'ORGANISM',
          key: 'category'
        },
        {
          name: 'CASES',
          key: 'cases'
        },
        {
          name: 'ADMISSIONS',
          key: 'admissions'
        },
        {
          name: 'SEPSIS RATE(%)',
          key: 'outcomeRate',
          formatter: (value: any)=> value ? `${value.toFixed(2)}%` : value !== undefined ? '0%' : ''
        }
      ];
      if(this.listOfCategories.length === 0){
        this.listOfCategories = (await firstValueFrom(this.organismService.getAll()))
          .map(organism => organism.organismName);
      }
      this.report = await this.reportService.getSepsisReport(
        this.dateMonthsRange,
        this.categoryFilterValue
      )
    }
    else{
      console.error('Unknown report type:', this.reportType);
      this.router.navigate(['/'])
    }
    if(this.report){
      for(let monthlyReport of this.report.monthlyReports){
        const records = monthlyReport.reportRecords
        records[records.length-1].outcomeRate = undefined
      }
    } 
  }

  getFormattedMonthAndYear(date: Date){
    date = new Date(date)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }).toUpperCase();
  }

  get getMonthRange(): string {
    const dates = this.dateMonthsRange;
    if (dates.length !== 2) return "";

    const [start, end] = dates.sort((a, b) => a.getTime() - b.getTime());

    const startMonth = start.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const endMonth = end.toLocaleString("en-US", { month: "short" }).toUpperCase();

    return `${startMonth}-${endMonth}`;
  }

  onMonthRangeChange(result: Date[]){
    this.fetchReports()
  }
  onCategoryFilterChange(filterValue: string){
    this.categoryFilterValue = filterValue;
    this.fetchReports()
  }

  downloadPdf() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    // Add Logo
    const logoX = 14;
    const logoY = 10;
    const logoWidth = 40;
    const logoHeight = 20;
    doc.addImage('images/logo.jpeg', 'JPEG', logoX, logoY, logoWidth, logoHeight);

    // Header Text aligned to right of logo
    const textX = pageWidth - 60;
    const textY = logoY + 6;

    doc.setFontSize(12);
    doc.text(this.currentDate.toLocaleDateString('en-GB'), textX, textY);
    doc.text(
      `Generated by: ${this.currentUser?.firstName} ${this.currentUser?.lastName}`,
      textX,
      textY + 8
    );

    // Report Title (below the header block)
    doc.setFontSize(16);
    const title = `LIST OF CURRENT ${this.reportType.toUpperCase()}`;
    doc.text(title, pageWidth / 2, logoY + logoHeight + 10, { align: 'center' });

    // Prepare tables for each month
    let currentY = 45;
    if (this.report && this.report.monthlyReports) {
      for (const monthlyReport of this.report.monthlyReports) {
        // Add month name above the table
        const monthDate = monthlyReport.reportMonthAndYear ? new Date(monthlyReport.reportMonthAndYear) : undefined;
        let monthLabel = monthDate ? monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toUpperCase() : '';
        if (monthLabel) {
          doc.setFontSize(13);
          doc.text(monthLabel, pageWidth / 2, currentY, { align: 'center' });
          currentY += 8;
        }

        // Prepare table rows for this month
        let tableRows = [];
        for (const record of monthlyReport.reportRecords) {
          const row = this.listOfColumns.map(col => {
            let value = (record as any)[col.key || ''];
            if (col.formatter) {
              return col.formatter(value);
            }
            return value !== undefined ? value : '';
          });
          tableRows.push(row);
        }

        autoTable(doc, {
          head: [this.listOfColumns.map(col => col.name)],
          body: tableRows,
          startY: currentY,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          theme: 'grid',
          didDrawPage: (data) => {
            if (data.cursor) {
              currentY = data.cursor.y + 10;
            } else {
              currentY += 30;
            }
          }
        });
      }
    }

    // Add Footer with Page Numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`${this.reportType}-report-${this.currentDate.toISOString().split('T')[0]}.pdf`);
  }
}
