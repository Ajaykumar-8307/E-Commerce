import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LoginPage } from './login-page/login-page';
import { RegisterPage } from './register-page/register-page';
import { OtpVerify } from './otp-verify/otp-verify';
import { ResendOtpPage } from './resend-otp-page/resend-otp-page';
import { UserProfile } from './users/user-profile/user-profile';

export const routes: Routes = [
  { path: '', component: HomePage },         // default route 
  { path: 'login', component: LoginPage },   // /login route
  { path: 'register', component: RegisterPage }, // /register route
  { path: 'verify', component: OtpVerify },
  { path: 'resendOtp', component: ResendOtpPage },
  { path: 'userprofile', component: UserProfile }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
