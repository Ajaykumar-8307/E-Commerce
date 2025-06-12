import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit{

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient){}

  isSidebarOpen = false;
  activeLink = 'profile';
  API_URL = 'https://e-commerce-bmp5.onrender.com/api/v1/user/changepass';

  user: any = {
    token: String,
    name: String,
    email: String
  }
  token: any;
  password: any;
  newpass: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.user.token = params['id'];
      this.token = params['id'];
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

  changePass(){
    this.http.post<any>(this.API_URL, {
      email: this.user.email,
      password: this.password,
      newpass: this.newpass
    }).subscribe({
      next: (res: any) => {
        alert(`${res.message}`);
      },
      error: (error: any) => {
        alert(`${error.error.message}`);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectLink(event: Event, link: string) {
    event.preventDefault();
    this.activeLink = link;
    const targetId = (event.target as HTMLAnchorElement).getAttribute('href')?.substring(1);
    if (targetId) {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  navToEdit(){
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('token');
      if(token){
        const decodedToken: any = jwtDecode(token);
        this.router.navigate(['/edit-profile'], {queryParams: {id: token}});
      }
    }
  }
}
