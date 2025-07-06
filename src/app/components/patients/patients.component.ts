import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  btnLoading: boolean[] = [];
  loading: boolean = false;
  filter: string = '';

  //LIFE CYCLE HOOKS
  constructor(private router: Router, private patientService: PatientService,
    private notificationService: NzNotificationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (res: Patient[]) => {
        this.patients = res;
        this.loading = false;
      },
      error: (err: any) => {
        this.notificationService.error("Error", err);
        this.loading = false;
      }
    });

    this.btnLoading.fill(false, 0, this.patients.length);
  }

  //UI LOGIC
  search(text: string) {
    this.patientService.search(text).pipe(debounceTime(1000)).subscribe({
      next: (res: Patient[]) => {
        const updated = [...res];
        this.patients = updated;
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'admin';
  }

  //NAVIGATIONS
  edit(id: string): void {
    if (this.authService.getRole()?.toLowerCase() === 'doctor') {
      this.router.navigate([`/doctor-dashboard/patient/${id}`]);
    }
    else if (this.authService.getRole()?.toLowerCase() === 'intern') {
      this.router.navigate([`/intern-dashboard/patient/${id}`]);
    }
    else {
      this.router.navigate([`/admin-dashboard/patient/${id}`]);
    }
  }
}
