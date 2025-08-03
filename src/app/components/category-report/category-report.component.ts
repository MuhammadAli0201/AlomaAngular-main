import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report-dto';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ColumnItem } from '../../models/column-item';
import { ActivatedRoute, Router } from '@angular/router';
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
}
