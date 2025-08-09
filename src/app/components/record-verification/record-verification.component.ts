import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CONSTANTS } from '../../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-record-verification',
  templateUrl: './record-verification.component.html',
  styleUrl: './record-verification.component.scss',
  standalone: false
})
export class RecordVerificationComponent implements OnInit {
  patients:Patient[]=[];
  loading:boolean = false;

  constructor(private patientService:PatientService, private notificationService:NzNotificationService, private router:Router){}

  ngOnInit(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (res: Patient[]) => {
        this.patients = res.filter(x => x.markAsCompletedId === CONSTANTS.markAsComplete.pending);
        this.loading = false;
      },
      error: (err: any) => {
        this.notificationService.error('Error', err);
        this.loading = false;
      },
    });

    // this.btnLoading.fill(false, 0, this.patients.length);
  }

  //navigation
  edit(id: string): void {
      this.router.navigate([`/doctor-dashboard/patient/${id}`], {queryParams: {verify: true}});
  }
}
