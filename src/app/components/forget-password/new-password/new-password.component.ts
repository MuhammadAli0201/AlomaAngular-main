import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';
import { PasswordUpdateRequest } from '../../../models/password-update-request';

@Component({
  selector: 'app-new-password',
  standalone: false,
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  loading: boolean = false;
  email: string = '';
  otp: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });

    this.email = this.activatedRoute.snapshot.params['email'];
    this.otp = this.activatedRoute.snapshot.params['code'];
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      const model: PasswordUpdateRequest = {
        email: this.email,
        code: this.otp,
        newPassword: this.passwordForm.value.newPassword
      };

      this.authService.updatePassword(model)
        .subscribe({
          next: (res) => {
            this.notification.success('Success', 'Password updated successfully!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.notification.error('Error', err?.error.message || 'Failed to update password');
          },
          complete: () => {
            this.loading = false;
          }
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
