import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments.prod';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss'
})
export class RegisterPage {

  user = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  };
  Api_URL = environment.apiUrl;
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}
  submit() {
    this.http.post<any>(`${this.Api_URL}/user/register`, this.user).subscribe({
      next: (res: any) => {
        alert('Registration successful');
        console.log('Registration successful', res);
        setTimeout(() => {
          this.router.navigate(['/verify'], { queryParams: {email: this.user.email, resend: false} });
        }, 1000);
      },
      error: (error: any) => {
        alert(error.error.message);
        console.error('Registration failed', error);
      }
    });
  }

}
