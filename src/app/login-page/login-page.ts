import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage {

  Api_URL = 'http://localhost:3000/api/v1/user/login';
  user = {
    email: 'kjajaykumar8307@gmail.com',
    password: 'Ajay'
  };
  message: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  submit(){
    this.http.post<any>(this.Api_URL, this.user).subscribe(res => {
      this.message = res.message;
      console.log('Login successful', res);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }, error => {
      this.message = error.error.message;
      console.error('Login failed', error);
    });
  }
}
