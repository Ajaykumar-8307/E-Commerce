import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  isSidebarOpen = false;
  activeLink = 'profile';
  API_URL = 'https://e-commerce-bmp5.onrender.com/api/v1/user';

  user: any = {
    id: String,
    token: String,
    name: String,
    email: String
  }
  token: any;
  password: any;
  newpass: any;
  email: any;

  userdetails: any = {
    phone: 'None',
    Address: 'None'
  }

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.user.token = params['id'];
      this.token = params['id'];

      if (this.token) {
        try {
          const deCodedToken: any = jwtDecode(this.token);
          this.user.name = deCodedToken.userName;
          this.user.email = deCodedToken.email;
          this.email = deCodedToken.email;
          this.user.id = deCodedToken.id;
          if (deCodedToken.isAdmin) {
            this.isAdmin = true;
          }

          this.http.get<any>(`${this.API_URL}/get-user-details`, {
            params: { email: this.email }
          }).subscribe({
            next: (res: any) => {
              this.userdetails.phone = res.userDetails.phone || 'None';
              this.userdetails.Address = res.userDetails.Address || 'None';
              this.cd.detectChanges();
            },
            error: (error: any) => {
              alert(`${error.error.message}`);
            }
          });

        } catch (err) {
          console.error("Invalid token", err);
          alert("Session expired or invalid token.");
          this.router.navigate(['/']);
        }
      }
    });
  }

  changePass() {
    this.http.post<any>(`${this.API_URL}/changepass`, {
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

  navToAdminPage(){
    this.router.navigate(['admin'], { queryParams: { id: this.token } });
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

  navToEdit() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.router.navigate(['/edit-profile'], { queryParams: { id: token } });
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      alert("Account Logout");
      this.router.navigate(['/']);
    }
  }

  delUser() {
    localStorage.clear();
    this.http.post<any>(`${this.API_URL}/deluser`, {
      email: this.user.email
    }).subscribe({
      next: (res: any) => {
        alert(`${res.message}`);
      },
      error: (error: any) => {
        alert(`${error.error.message}`);
      }
    });
    this.router.navigate(['/']);
  }
}
