import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, Sidebar, RouterOutlet],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss'
})
export class AdminPage {

  isSidebarOpen = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateToSection(section: string) {
    this.router.navigate([`/admin/${section}`]);
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

}
