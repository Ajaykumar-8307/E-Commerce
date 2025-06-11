import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resend-otp-page',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './resend-otp-page.html',
  styleUrl: './resend-otp-page.scss'
})
export class ResendOtpPage {

  constructor(private http: HttpClient, private route: Router){}

  email = '';

  API_URL = 'https://e-commerce-bmp5.onrender.com/api/v1/user/resendotp';

  resendOtp(){
    this.http.post<any>(this.API_URL, {
      email: this.email
    }).subscribe({
      next: (res: any) => {
        alert("OTP Sent Successfully");
        setTimeout(() => {
          this.route.navigate(['/verify'], { queryParams: {email: this.email, resend: false} });
        }, 1000);
        console.log("Sent Otp");
      }, error: (error: any) => {
        alert(`${error.error.message}`);
      }
    });
  }
}
