import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environments.prod';

@Component({
  selector: 'app-products',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  products: any[] = [];

  API_Link = environment.apiUrl;
  token: any;
  id: string = '';
  pro_id: string = '';

  loading = true;

  constructor(private router: Router, private http: HttpClient, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      if (this.token) {
        const deCodedToken: any = jwtDecode(this.token);
        this.id = deCodedToken.id;
        console.log(this.id);
        this.cd.detectChanges();
      }
      this.http.get<any[]>(`${this.API_Link}/product/adminproducts`, { params: { adminId: this.id } }).subscribe({
        next: (res: any) => {
          this.products = res;
          console.log(res);
          this.cd.detectChanges();
          this.loading = false
        },
        error: (error: any) => {
          alert(`${error.error.message}, Try Again Later`);
          this.loading = false;
        }
      });
    }
  }

  navToAddProducts() {
    this.router.navigate(['/admin/add-products']);
  }

  delProducts(product: any) {
    if (typeof window !== 'undefined') {
      console.log(`${product._id}`);
      this.http.post(`${this.API_Link}/product/deleteproduct`, {
        id: product._id
      }).subscribe({
        next: (res: any) => {
          alert(`${res.message}`);
          window.location.reload();
        },
        error: (error: any) => {
          alert(`${error.error.message}`);
          console.log("Error");
        }
      });
    }
  }

}
