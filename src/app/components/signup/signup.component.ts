import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  
  // Define available roles
  roles: string[] = ["Doctor", "Intern", "Admin"];
  
  constructor(private fb : FormBuilder, private auth: AuthService, private router: Router, private notification:NzNotificationService){}
  
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required] // Add role field with validation
    })
  }
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  
  onSignup(){
    if(this.signUpForm.valid){
      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next:(res=>{
          this.notification.success("success",res.message)
          this.signUpForm.reset();
          this.router.navigate(['login'])
        }),
        error:(err=>{
          this.notification.error("error",err?.error.message)
        })
      }) 
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm)
    }
  }
}
