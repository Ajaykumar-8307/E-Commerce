import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage {

  message: string = '';
  Api_URL = 'http://localhost:3000/api/v1/user/login';
  user = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  submit(){
    this.http.post<any>(this.Api_URL, this.user).subscribe(
      {
        next: (res: any) => {
          this.message = res.message;
          console.log('Login successful', res);
          localStorage.setItem('token', res.token);
        },
        error: (error) => {
          this.message = error.error.message;
          console.error('Login failed', error);
        }
      }
    );
  }
}
