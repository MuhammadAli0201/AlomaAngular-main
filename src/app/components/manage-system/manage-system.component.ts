import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manage-system',
  standalone: false,
  templateUrl: './manage-system.component.html',
  styleUrl: './manage-system.component.scss'
})
export class ManageSystemComponent implements OnInit {
  otpSettingsForm!: FormGroup;
  loading: boolean = false;
  currentTimer: number = 5; // Default 5 minutes

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentOtpTimer();
  }

  initializeForm(): void {
    this.otpSettingsForm = this.fb.group({
      timerMinutes: [5, [Validators.required, Validators.min(1), Validators.max(30)]]
    });
  }

  loadCurrentOtpTimer(): void {
    this.loading = true;
    this.authService.getOtpTimer().subscribe({
      next: (response) => {
        this.currentTimer = parseInt(response.Timer);
        this.otpSettingsForm.patchValue({
          timerMinutes: this.currentTimer
        });
      },
      error: (err) => {
        this.notification.error('Error', 'Failed to load current OTP timer settings');
        console.error('Error loading OTP timer:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateOtpTimer(): void {
    if (this.otpSettingsForm.valid) {
      this.loading = true;
      const minutes = this.otpSettingsForm.value.timerMinutes;

      this.authService.updateOtpTimer(minutes).subscribe({
        next: (response) => {
          this.currentTimer = minutes;
          this.notification.success('Success', `OTP timer updated to ${minutes} minutes`);
        },
        error: (err) => {
          this.notification.error('Error', 'Failed to update OTP timer settings');
          console.error('Error updating OTP timer:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Object.values(this.otpSettingsForm.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
