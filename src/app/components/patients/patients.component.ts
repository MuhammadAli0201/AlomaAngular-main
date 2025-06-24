import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';

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

  delete(id: string, index: number): void {
    this.btnLoading[index] = true;

    this.patientService.delete(id).subscribe({
      next: (val: boolean) => {
        if (val) {
          const i = this.patients.findIndex(x => x.id === id);

          if (i > -1) {
            const updated = [...this.patients];
            updated.splice(i, 1);
            this.patients = updated;

            const btns = [...this.btnLoading];
            btns.splice(index, 1);
            this.btnLoading = btns;

            this.notificationService.success("Success", "Deleted successfully");
          }
        }
      },
      error: () => {
        this.btnLoading[index] = false;
        this.notificationService.error("Error", "Failed to delete");
      }
    });
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
