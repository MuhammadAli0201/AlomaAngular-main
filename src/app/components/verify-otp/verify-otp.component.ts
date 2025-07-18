import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpVerifyRequest } from '../../models/otp-verify-request';

@Component({
  selector: 'app-verify-otp',
  standalone: false,
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent implements OnDestroy {
  otpForm!: FormGroup;
  email: string = '';
  loading: boolean = false;
  is2fa: boolean = false;
  countdown: number = 0;
  countdownInterval: any;
  canResend: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private notification: NzNotificationService, private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });

    this.email = this.activeRoute.snapshot.params['email'];
    this.is2fa = this.activeRoute.snapshot.queryParamMap.get('is2fa') === 'true';
    console.log(this.is2fa);
    this.loadOtpTimer();
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      this.loading = true;

      const otpVerifyRequest: OtpVerifyRequest = {
        email: this.email,
        code: this.otpForm.value.otp
      };
 
      this.authService.verifyOtp(otpVerifyRequest).subscribe({
        next: (res) => {
          this.notification.success("Success", res.message);
          this.otpForm.reset();
          if(this.is2fa){
            this.router.navigate(['login'])
          }
          else{
            this.router.navigate(['new-password', this.email, otpVerifyRequest.code]);
          }
        },
        error: (err) => {
          this.notification.error("Error", err?.error.message);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Object.values(this.otpForm.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
      );
    }
  }

  loadOtpTimer(): void {
    this.authService.getOtpTimer().subscribe({
      next: (response) => {
        const timerMinutes = parseInt(response.Timer);
        this.countdown = timerMinutes * 60; // Convert to seconds
        this.startCountdown();
      },
      error: (err) => {
        // Default to 5 minutes if unable to load timer
        this.countdown = 5 * 60;
        this.startCountdown();
      }
    });
  }

  startCountdown(): void {
    this.canResend = false;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  resendOtp(): void {
    if (this.canResend) {
      this.loading = true;
      this.authService.sendOtp(this.email).subscribe({
        next: (res) => {
          this.notification.success('Success', 'OTP sent successfully');
          this.loadOtpTimer(); // Restart timer
        },
        error: (err) => {
          this.notification.error('Error', 'Failed to send OTP');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
