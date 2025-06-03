import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LoginPage } from './login-page/login-page';
import { RegisterPage } from './register-page/register-page';

export const routes: Routes = [
  { path: '', component: HomePage },         // default route 
  { path: 'login', component: LoginPage },   // /login route
  { path: 'register', component: RegisterPage }, // /register route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
