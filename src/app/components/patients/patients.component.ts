import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';
import { debounceTime } from 'rxjs';
import { CONSTANTS } from '../../constants';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  btnLoading: boolean[] = [];
  loading: boolean = false;
  filter: string = '';

  //LIFE CYCLE HOOKS
  constructor(
    private router: Router,
    private patientService: PatientService,
    private notificationService: NzNotificationService,
    private authService: AuthService,
    private modalService:NzModalService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (res: Patient[]) => {
        this.patients = res;
        if (this.isIntern()) {
          this.patients = this.patients.filter(
            (x) => x.markAsCompletedId !== CONSTANTS.markAsComplete.accepted
          );
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.notificationService.error('Error', err);
        this.loading = false;
      },
    });

    this.btnLoading.fill(false, 0, this.patients.length);
  }

  //UI LOGIC
  search(text: string) {
    this.patientService
      .search(text)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (res: Patient[]) => {
          const updated = [...res];
          this.patients = updated;
        },
      });
  }

  isAdmin(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'admin';
  }

  isIntern(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'intern';
  }

  isDisabled(id: string): boolean {
    const patient = this.patients.find((x) => x.id === id);
    return (
      patient?.markAsCompletedId === CONSTANTS.markAsComplete.pending ||
      patient?.markAsCompletedId === CONSTANTS.markAsComplete.accepted
    );
  }

  markAsComplete(id: string): void {
    const index = this.patients.findIndex((x) => x.id === id);
    this.btnLoading[index] = true;
    this.patientService.markAsComplete(id).subscribe({
      next: (res: Patient) => {
        if (index != -1) {
          this.patients[index] = res;
        }
      },
      error: (err: any) => {
        this.notificationService.error('Error', err);
      },
      complete: () => {
        this.btnLoading[index] = false;
      },
    });
  }

  getStatus(id: string): string {
    if (id === CONSTANTS.markAsComplete.accepted) {
      return 'Verified';
    } else if (id === CONSTANTS.markAsComplete.rejected) {
      return 'Rejected';
    } else if (id === CONSTANTS.markAsComplete.pending) {
      return 'Pending';
    }
    return '';
  }

  isRejected(id: string): boolean {
    const patient = this.patients.find((x) => x.id === id);
    if (patient) {
      return patient.markAsCompletedId === CONSTANTS.markAsComplete.rejected;
    }
    return false;
  }
  
  rejectReason(id:string):void{
    const patient = this.patients.find((x) => x.id === id);
    if (patient) {
      this.modalService.create({
        nzContent: patient.rejectComments,
        nzCentered:true,
        nzOkText: null,
        nzCancelText: "Close"
      });
    }
  }

  //NAVIGATIONS
  edit(id: string): void {
    if (this.authService.getRole()?.toLowerCase() === 'doctor') {
      this.router.navigate([`/doctor-dashboard/patient/${id}`]);
    } else if (this.authService.getRole()?.toLowerCase() === 'intern') {
      this.router.navigate([`/intern-dashboard/patient/${id}`]);
    } else {
      this.router.navigate([`/admin-dashboard/patient/${id}`]);
    }
  }
}
