import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, Sidebar, RouterOutlet],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage implements OnInit {

  isSidebarOpen = false;

  token: any = '';
  isAdmin: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');

      if (this.token && typeof this.token === 'string') {
        try {
          const deCodedToken: any = jwtDecode(this.token);
          this.isAdmin = deCodedToken?.isAdmin || false;

          if (!this.isAdmin) {
            alert('Unauthorized Access');
            this.router.navigate(['/']);
          }

        } catch (error) {
          console.error('Invalid token:', error);
          alert('Invalid token. Please login again.');
          this.router.navigate(['/']);
        }
      } else {
        alert('No token found. Please login.');
        this.router.navigate(['/']);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToSection(section: string) {
    this.router.navigate([`/admin/${section}`]);
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  refresh() {
    window.location.reload();
  }

}
