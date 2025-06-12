import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile-edit',
  imports: [CommonModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss']
})
export class ProfileEdit implements OnInit{

  constructor(private router: Router, private route: ActivatedRoute){}

  isSidebarOpen = false;

  user = {
    name: String,
    email: String,
    phone: Number,
    Address: String
  }

  id: String = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });
    if(typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.user.name = decodedToken.userName;
        this.user.email = decodedToken.email;
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}