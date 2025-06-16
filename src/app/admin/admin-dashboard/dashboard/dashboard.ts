import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  token: any = '';

  admin = {
    name: String,
    isAdmin: false
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      if (this.token) {
        const deCodedToken: any = jwtDecode(this.token);
        if (deCodedToken) {
          this.admin.isAdmin = deCodedToken.isAdmin;
          this.admin.name = deCodedToken.userName;
          console.log(this.admin.isAdmin);
        }
        if (!this.admin.isAdmin) {
          alert('UnAuthorized Access');
          this.router.navigate(['/']);
        }
      } else {
        alert('Login First');
        this.router.navigate(['/login']);
      }
    }
  }

}
