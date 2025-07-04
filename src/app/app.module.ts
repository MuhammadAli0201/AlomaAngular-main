import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { InternDashboardComponent } from './components/intern-dashboard/intern-dashboard.component';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { ManageFormTemplateComponent } from './components/manage-form-template/manage-form-template.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { HelpResourceComponent } from './components/help-resource/help-resource.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { AdminWelcomeComponent } from './components/admin-dashboard/admin-welcome/admin-welcome.component';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { antdIcons, AntdModule } from './antd.module';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { NewPasswordComponent } from './components/forget-password/new-password/new-password.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientComponent } from './components/patients/patient/patient.component'; 
import { MaternalComponent } from './components/patients/maternal/maternal.component'; 
import { CreatePatientComponent } from './components/patients/create-patient/create-patient.component';
import { PatientFullFormComponent } from './components/patients/patient-full-form/patient-full-form.component';
import { InternWelcomeComponent } from './components/intern-dashboard/intern-welcome/intern-welcome.component';
import { HelpResoucesComponent } from './components/help-resouces/help-resouces.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ManageFormTemplateComponent,
    DashboardComponent,
    AdminDashboardComponent,
    InternDashboardComponent,
    DoctorDashboardComponent,
    ProfileModalComponent,
    HelpResourceComponent,
    AdminWelcomeComponent,
    ManageUsersComponent,
    ForgetPasswordComponent,
    VerifyOtpComponent,
    NewPasswordComponent,
    PatientsComponent,
    PatientComponent, 
    MaternalComponent,
    CreatePatientComponent,
    PatientFullFormComponent,
    InternWelcomeComponent,
    HelpResoucesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    HighlightPipe,
    AntdModule
  ],
  providers: [ApiService, AuthService, provideNzI18n(en_US), provideAnimationsAsync(), provideHttpClient(),
    { provide: NZ_ICONS, useValue: antdIcons },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
