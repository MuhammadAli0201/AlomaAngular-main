import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];

  //LIFE CYCLE HOOKS
  constructor(private router: Router, private patientService: PatientService, private notificationService: NzNotificationService) { }

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe({
      next: (res: Patient[]) => {
        this.patients = res;
      },
      error: (err: any) => {
        this.notificationService.error("Error", err);
      }
    });
  }

  //NAVIGATIONS
  edit(id:string): void {
    this.router.navigate([`/doctor-dashboard/patient/${id}`]);
  }
}
