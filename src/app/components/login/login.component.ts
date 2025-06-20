import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernumber: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin() {
    if (this.loginForm.valid) {

      // Send obj to database
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.notification.success("Success", res.message);
            this.auth.storeToken(res.token);
            this.auth.storeRole(res.role);

            this.loginForm.reset();

            // Navigate based on role
            this.navigateBasedOnRole(res.role);
          },
          error: (err) => {
            this.notification.error("error",
              err?.error.message);
          }
        });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      this.notification.error("error","Your form is invalid");
    }
  }

  // New method to navigate based on role
  navigateBasedOnRole(role: string) {
    switch (role) {
      case 'Doctor':
        this.router.navigate(['doctor-dashboard']);
        break;
      case 'Intern':
        this.router.navigate(['intern-dashboard']);
        break;
      case 'Admin':
        this.router.navigate(['admin-dashboard']);
        break;
      default:
        this.router.navigate(['dashboard']);
        break;
    }
  }
}