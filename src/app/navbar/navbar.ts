import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Navbar implements OnInit {
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  categories: string[] = ['Food', 'Electronics', 'Dress', 'FootWear'];
  pro_cat: string = '';
  user: any;

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken.userName;
      localStorage.setItem('admin', decodedToken.isAdmin);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.user = null;
  }
}
