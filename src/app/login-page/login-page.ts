import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage {

  Api_URL = 'http://localhost:3000/api/v1/user/login';
  user = {
    email: '',
    password: ''
  };

  get: any;

  constructor(private router: Router, private http: HttpClient) {}

  submit(){
    this.http.post<any>(this.Api_URL, this.user).subscribe(
      {
        next: (res: any) => {
          alert('Login successful');
          console.log('Login successful', res);
          localStorage.setItem('token', res.token);
          const decodedToken: any = jwtDecode(res.token);
          localStorage.setItem('admin', decodedToken.isAdmin);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          alert(error.error.message);
          console.error('Login failed', error);
        }
      }
    );
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
