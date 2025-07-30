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
      await this.setupInternsReport();
    }
    else if(this.reportType === 'doctors'){
      this.setupDoctorsReport()
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

  async setupInternsReport(){
    this.listOfColumns = [
      {
        name: 'Hospital Number',
        key: 'hospitalNumber'
      },
      {
        name: 'Name and surname',
        key: 'name'
      },
      {
        name: 'Start Date',
        key: 'startDate'
      },
      {
        name: 'End of rotation',
        key: 'endOfRotation'
      }
    ];

    const interns = await this.authService.getUsersByRoleAndVerifiedMonth('Intern',this.currentMonthDate.getMonth() + 1)
    this.tableData = interns.map(intern =>{
      const endOfRotation = intern.verifiedDate 
        ? new Date(intern.verifiedDate)
        : null;
      endOfRotation?.setMonth(endOfRotation?.getMonth() + 3);
      return {
        hospitalNumber: intern.usernumber,
        name: intern.firstName + ' ' + intern.lastName,
        startDate: intern.verifiedDate,
        endOfRotation: endOfRotation?.toLocaleDateString('en-GB')
      }
    })
  }

  async setupDoctorsReport(){
    this.listOfColumns = [
      {
        name: 'Hospital Number',
        key: 'hospitalNumber'
      },
      {
        name: 'Name and surname',
        key: 'name'
      },
      {
        name: 'Start Date',
        key: 'startDate'
      }
    ];

    const doctors = await this.authService.getUsersByRoleAndVerifiedMonth('Doctor',this.currentMonthDate.getMonth() + 1)
    this.tableData = doctors.map(doctor =>{
      return {
        hospitalNumber: doctor.usernumber,
        name: doctor.firstName + ' ' + doctor.lastName,
        startDate: doctor.verifiedDate,
      }
    })
  }
}
