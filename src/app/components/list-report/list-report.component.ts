import { Component, OnInit } from '@angular/core';
import { ColumnItem } from '../../models/column-item';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-list-report',
  standalone: false,
  templateUrl: './list-report.component.html',
  styleUrl: './list-report.component.scss',
})
export class ListReportComponent {
  reportType!: string;
  listOfColumns: ColumnItem[] = [];
  tableData: any[] = [];
  currentDate = new Date();
  currentUser: User | undefined;
  currentMonthDate: Date = new Date();

  constructor(private route: ActivatedRoute, private router: Router,
    private authService: AuthService,
    private patientService: PatientService
  ) {
    this.currentMonthDate = new Date();
    this.route.params.subscribe(params => {
      this.reportType = params['type'];
      this.setupReport();
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    })
  }

  onMonthChange(date: Date) {
    if (date) {
      this.currentMonthDate = date;
      this.setupReport();
    }
  }

  async setupReport(){
    if(this.reportType === 'patients'){
      await this.setupPatientsReport();
    }
    else if(this.reportType === 'interns'){
      console.log('interns report')
    }
    else if(this.reportType === 'doctors'){
      console.log('doctors report')
    }
    else{
      console.error('Unknown report type:', this.reportType);
      this.router.navigate(['/'])
    }
  }

  async setupPatientsReport(){
    this.listOfColumns = [
      {
        name: 'Hospital Number',
        key: 'hospitalNumber'
      },
      {
        name: 'Name',
        key: 'name'
      },
      {
        name: 'Gender',
        key: 'gender'
      },
      {
        name: 'Date Admission',
        key: 'dateOfAdmission'
      }
    ];

    this.patientService.getPatientsByAdmissionMonth(this.currentMonthDate.getMonth() + 1).subscribe((allpatients: Patient[]) =>{
      this.tableData = allpatients.map(patient =>({
        hospitalNumber: patient.hospitalNumber,
        name: patient.name,
        gender: patient.gender,
        dateOfAdmission: patient.dateOfAdmission
      ? new Date(patient.dateOfAdmission).toLocaleDateString('en-GB')
      : ''
      }))
    })
  }
}
