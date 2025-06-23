import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environments.prod';

@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  token: any = '';
  API_Link = environment.apiUrl;

  products: any[] = [];

  admin = {
    name: '',
    isAdmin: false,
    id: ''
  }

  lenght: Number = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      if (this.token) {
        const deCodedToken: any = jwtDecode(this.token);
        if (deCodedToken) {
          this.admin.isAdmin = deCodedToken.isAdmin;
          this.admin.name = deCodedToken.userName;
          this.admin.id = deCodedToken.id;
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

      this.http.get<any[]>(`${this.API_Link}/product/adminproducts`, { params: { adminId: this.admin.id } }).subscribe({
        next: (res: any) => {
          this.products = res;
          console.log(res);
          this.cd.detectChanges();
        },
        error: (error: any) => {
          alert(`${error.error.message}, Try Again Later`);
        }
      });
    }
  }

  getProductCount(): Number {
    this.lenght = this.products.length;
    return this.lenght;
  }
}
