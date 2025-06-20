import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LoginPage } from './login-page/login-page';
import { RegisterPage } from './register-page/register-page';
import { OtpVerify } from './otp-verify/otp-verify';
import { ResendOtpPage } from './resend-otp-page/resend-otp-page';
import { UserProfile } from './users/user-profile/user-profile';
import { ProfileEdit } from './users/profile-edit/profile-edit';
import { AdminPage } from './admin/admin-dashboard/admin-page/admin-page';
import { Dashboard } from './admin/admin-dashboard/dashboard/dashboard';
import { Products } from './admin/admin-dashboard/products/products';
import { Orders } from './admin/admin-dashboard/orders/orders';
import { Settings } from './admin/admin-dashboard/settings/settings';
import { AddProducts } from './admin/admin-dashboard/add-products/add-products';
import { ProductDetails } from './products/product-details/product-details';
import { ProductEdit } from './admin/admin-dashboard/product-edit/product-edit';

export const routes: Routes = [
  { path: '', component: HomePage },         // default route 
  { path: 'login', component: LoginPage },   // /login route
  { path: 'register', component: RegisterPage }, // /register route
  { path: 'verify', component: OtpVerify },
  { path: 'resendOtp', component: ResendOtpPage },
  { path: 'userprofile', component: UserProfile },
  { path: 'edit-profile', component: ProfileEdit },
  { path: 'products', component: ProductDetails },

  //admin page
  {
    path: 'admin', component: AdminPage,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'orders', component: Orders },
      { path: 'settings', component: Settings },
      { path: 'add-products', component: AddProducts },
      { path: 'edit-product', component: ProductEdit }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
