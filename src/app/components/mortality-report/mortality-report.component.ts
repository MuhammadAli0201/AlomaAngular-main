import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ReportService } from '../../services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ColumnItem } from '../../models/column-item';
import { MortalityReportDto } from '../../models/mortality-report-dto';

@Component({
  selector: 'app-mortality-report',
  standalone: false,
  templateUrl: './mortality-report.component.html',
  styleUrl: './mortality-report.component.scss'
})
export class MortalityReportComponent {
  currentUser: any;
  listOfColumns: ColumnItem[] = []
  mortalityReport: MortalityReportDto | undefined;
  chart: any = null
  currentYearDate: Date = new Date()
  currentYearNumber = new Date().getFullYear()

  constructor(private route: ActivatedRoute, private router: Router,
    private reportService: ReportService,
    private authService: AuthService){
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
    this.setupReport();
  }
  async setupReport(){
    this.listOfColumns = [
      {
        name: 'Month',
        key: 'month'
      },
      {
        name: 'Admission',
        key: 'admissions'
      },
      {
        name: 'Death',
        key: 'deaths'
      },
      {
        name: 'Mortality Rate',
        key: 'mortalityRate',
        formatter: (value: any)=> value ? `${value.toFixed(2)}%` : '0%'
      }
    ];
    this.mortalityReport = await this.reportService.getMortalityReport(this.currentYearNumber)
    console.log(this.mortalityReport)
    this.setupChart();
  }

  setupChart(){
    if(this.chart){
      this.chart.destroy();
    }
    let labels: string[] = [];
    let admissions: number[] = [];
    let deaths: number[] = [];
    if(this.mortalityReport){
      this.mortalityReport.monthlyRecords.forEach(record => {
        labels.push(record.month);
        admissions.push(record.admissions);
        deaths.push(record.deaths);
      });
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Deaths',
            data: deaths,
            borderWidth: 1,
          },
          {
            label: 'Admissions',
            data: admissions,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 5
                },
                title: {
                    display: true,
                    text: 'Count',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
      },
    });
  }

  onYearChange(yearDate: Date){
    this.currentYearNumber = yearDate.getFullYear();
    this.setupReport();
  }
}
