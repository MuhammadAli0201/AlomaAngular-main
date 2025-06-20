import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpVerifyRequest } from '../../../models/otp-verify-request';

@Component({
  selector: 'app-verify-otp',
  standalone: false,
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  otpForm!: FormGroup;
  email: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private notification: NzNotificationService, private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });

    this.email = this.activeRoute.snapshot.params['email'];
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
          this.router.navigate(['new-password', this.email, otpVerifyRequest.code]);
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
}
