import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';
import { SystemSettingService } from '../../services/system-setting.service';
import { SystemSetting } from '../../models/system-setting';

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
  internRemainingDays: number|undefined;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private notification: NzNotificationService,
    private systemSettingService: SystemSettingService
  ) {}

  async ngOnInit() {
    this.initializeForm();
    this.loadCurrentOtpTimer();
    const systemSetting = await this.systemSettingService.getBykey("InternRemainingRotationDays")
    this.internRemainingDays = parseInt(systemSetting.value);
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

  updateInternRemainingDays(){
    if (this.internRemainingDays !== undefined && this.internRemainingDays > 0) {
      const systemSetting: SystemSetting = {
        key: "InternRemainingRotationDays",
        value: this.internRemainingDays.toString()
      };

      this.systemSettingService.update("InternRemainingRotationDays", systemSetting).then(() => {
        this.notification.success('Success', `Intern remaining days updated to ${this.internRemainingDays} days`);
      }).catch(err => {
        this.notification.error('Error', 'Failed to update intern remaining days');
        console.error('Error updating intern remaining days:', err);
      });
    } else {
      this.notification.error('Error', 'Please enter a valid number of days');
    }
  }
}
