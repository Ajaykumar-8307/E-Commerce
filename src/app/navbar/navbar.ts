import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router, private route: ActivatedRoute){}
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  categories: string[] = ['Food', 'Electronics', 'Dress', 'FootWear'];
  pro_cat: string = '';
  user: any;

  ngOnInit() {
    if(typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try{
          const decodedToken: any = jwtDecode(token);
          this.user = decodedToken.userName;
          localStorage.setItem('admin', decodedToken.isAdmin);
        } catch (error){
          this.logout();
        }
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      this.user = null;
    }
  }

  navToProfile(){
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('token');
      if(token){
        const decodedToken: any = jwtDecode(token);
        this.router.navigate(['/userprofile'], {queryParams: {id: token}});
      }
    }
  }

  navToCart(){
    this.router.navigate(['/cart']);
  }
}
