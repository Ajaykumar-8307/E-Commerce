import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-otp-verify',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.scss'
})
export class OtpVerify implements OnInit {
  Api_URL = 'http://localhost:3000/api/v1/user/verify';
  verify = {
    email: '',
    otp: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.verify.email = params['email'];
    });
    this.resentOtp();
  }

  verifi(){
    this.http.post<any>(this.Api_URL, this.verify).subscribe({
      next: (res: any) => {
        alert("Verification Successful");
        console.log('Verification successful', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/login']);
      }, error: (error: any) => {
        alert(error.error.message);
        console.error('Verification failed', error);
      }
    })
  }

  resentOtp(){
    this.http.post<any>('http://localhost:3000/api/v1/user/resendotp', { email: this.verify.email }).subscribe({
      next: (res: any) => {
        alert("OTP Resent Successfully");
        console.log('OTP resent successfully', res);
      }, error: (error: any) => {
        alert(error.error.message);
        console.error('Error resending OTP', error);
      }
    })
  }

}
