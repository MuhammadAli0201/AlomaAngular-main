import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report-dto';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { ColumnItem } from '../../models/column-item';
import { ActivatedRoute, Router } from '@angular/router';

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
  listOfColumns: ColumnItem[] = []
  dateMonthsRange: Date[] = []

  constructor(private route: ActivatedRoute, private router: Router,
    private reportService: ReportService,
    private authService: AuthService
  ){
    this.route.params.subscribe(params => {
      this.reportType = params['type'];
      this.setupReport();
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
  }
  async setupReport(){
    this.listOfColumns = [
      {
        name: 'Outcome',
        key: 'category'
      },
      {
        name: 'Cases',
        key: 'cases'
      },
      {
        name: 'Admission',
        key: 'admissions'
      },
      {
        name: 'Outcome Rate',
        key: 'outcomeRate',
        formatter: (value: any)=> value ? `${value.toFixed(2)}%` : '0%'
      }
    ];
    this.fetchReports()
  }

  async fetchReports(){
    this.dateMonthsRange = this.dateMonthsRange.sort((a, b) => a.getTime() - b.getTime());
    if(this.reportType === 'outcome'){
      this.report = await this.reportService.getOutcomeReport(
        this.dateMonthsRange
      )
    }
    else if(this.reportType === 'sepsis'){
      this.report = await this.reportService.getSepsisReport(
        this.dateMonthsRange
      )
    }
    else{
      console.error('Unknown report type:', this.reportType);
      this.router.navigate(['/'])
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
}
