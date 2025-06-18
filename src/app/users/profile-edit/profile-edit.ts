import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environments.prod';

@Component({
  selector: 'app-profile-edit',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss']
})
export class ProfileEdit implements OnInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ){}

  isSidebarOpen = false;

  API_URL = environment.apiUrl;

  user = {
    name: '',
    email: '',
    phone: 'None',
    Address: 'None'
  }

  id: string = '';
  email: string = '';

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
        this.email = decodedToken.email;
      }
      this.http.get<any>(`${this.API_URL}/user/get-user-details`, { params: { email: this.user.email } }).subscribe({
        next: (res: any) => {
          this.user.phone = res.userDetails.phone;
          this.user.Address = res.userDetails.Address;
          this.cd.detectChanges();
          console.log(this.user.phone);
        },
        error: (error: any) => {
          alert(`${error.error.message}`);
        }
      });
    }
  }

  OnSubmit(){
    if(this.user){
      this.http.put<any>(this.API_URL+'/update-profile', this.user).subscribe({
        next: (res: any) => {
          alert(`${res.message}`);
        },
        error: (error: any) => {
          alert(`${error.error.message}`);
        }
      });
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