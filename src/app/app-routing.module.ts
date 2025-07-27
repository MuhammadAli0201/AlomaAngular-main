import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { DoctorDashboardComponent } from './components/doctor-dashboard/doctor-dashboard.component';
import { InternDashboardComponent } from './components/intern-dashboard/intern-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageFormTemplateComponent } from './components/manage-form-template/manage-form-template.component';
import { HelpResourceComponent } from './components/help-resource/help-resource.component';
import { AdminWelcomeComponent } from './components/admin-dashboard/admin-welcome/admin-welcome.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { NewPasswordComponent } from './components/forget-password/new-password/new-password.component';
import { DoctorWelcomeComponent } from './components/doctor-dashboard/doctor-welcome/doctor-welcome.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientComponent } from './components/patients/patient/patient.component';
import { MaternalComponent } from './components/patients/maternal/maternal.component';
import { CreatePatientComponent } from './components/patients/create-patient/create-patient.component';
import { DiagnosisTreatmentFormComponent } from './components/patients/diagnosis-treatment-form/diagnosis-treatment-form.component';
import { InternWelcomeComponent } from './components/intern-dashboard/intern-welcome/intern-welcome.component';
import { HelpResoucesComponent } from './components/help-resouces/help-resouces.component';
import { ManageSystemComponent } from './components/manage-system/manage-system.component';


const patientRoutes: Routes = [
  { path: 'patients', component: PatientsComponent },
  {
    path: 'patient', component: PatientComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreatePatientComponent }
    ]
  },
  {
    path: 'patient/:id', component: PatientComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreatePatientComponent },
      { path: 'maternal', component: MaternalComponent },
      { path: 'full', component: DiagnosisTreatmentFormComponent },
    ]
  },
  {
    path: 'help-resources', component: HelpResoucesComponent,
  }
];

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset', component: ForgetPasswordComponent },
  { path: 'verify/:email', component: VerifyOtpComponent },
  { path: 'new-password/:email/:code', component: NewPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'Doctor' },
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: DoctorWelcomeComponent, },
      ...patientRoutes
    ]
  },
  {
    path: 'intern-dashboard',
    component: InternDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'Intern' },
    children: [
      { path: "", component: InternWelcomeComponent },
      ...patientRoutes
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'Admin' },
    children: [
      {
        path: '', redirectTo: 'welcome', pathMatch: 'full'
      },
      {
        path: 'welcome', component: AdminWelcomeComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      {
        path: 'management-form-template', component: ManageFormTemplateComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      {
        path: 'faq', component: HelpResourceComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      {
        path: 'help-resources', component: HelpResoucesComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      {
        path: 'users', component: ManageUsersComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      {
        path: 'manage-system',
        component: ManageSystemComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'Admin' }
      },
      ...patientRoutes
    ]
  },

  // Wildcard route for any unmatched routes
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }