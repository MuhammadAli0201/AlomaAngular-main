import { Component } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PatientService } from '../../../../services/patient.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reject-patient',
  standalone: false,
  templateUrl: './reject-patient.component.html',
  styleUrl: './reject-patient.component.scss',
})
export class RejectPatientComponent {
  patientId: string = '';
  loading: boolean = false;
  rejectReason: FormControl = new FormControl('', Validators.required);
  constructor(
    private nzModalRef: NzModalRef,
    private patientService: PatientService
  ) {}

  //UI LOGIC
  reject(): void {
    if (this.rejectReason.invalid) {
      this.rejectReason.markAsTouched({ onlySelf: true });
      this.rejectReason.updateValueAndValidity();
      return;
    }

    this.loading = true;
    this.patientService
      .rejectPatient(this.patientId, this.rejectReason.value)
      .subscribe({
        complete: () => {
          this.loading = false;
          this.close(false);
        },
      });
  }

  //NAVIGATIONS
  close(param:boolean = true): void {
    this.nzModalRef.close(param);
  }
}
