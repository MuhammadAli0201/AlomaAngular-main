import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private notification: NzNotificationService, private router: Router) { }
  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOtp() {
    if (this.forgetPasswordForm.valid) {
      this.loading = true;
      this.authService.sendOtp(this.forgetPasswordForm.value.email).subscribe({
        next: (res) => {
          this.notification.success("Success", res.message);
          this.router.navigate(['verify', this.forgetPasswordForm.value.email]);
        },
        error: (err) => {
          this.notification.error("Error", err?.error.message);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Object.values(this.forgetPasswordForm.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
      );
    }
  }
}
