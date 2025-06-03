import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage {

  constructor(private router: Router) {}

  submit(){
    localStorage.setItem('isLoggedIn', 'true');
  }

}
