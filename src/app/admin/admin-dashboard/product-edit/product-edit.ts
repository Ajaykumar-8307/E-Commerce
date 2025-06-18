import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss'
})
export class ProductEdit implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  pro_id: String = '';

  product: any = {
    name: '',
    category: '',
    price: '',
    stocks: '',
    location: '',
    description: '',
    adminId: ''
  };

  API_Link = environment.apiUrl;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.route.queryParams.subscribe((params) => {
        this.pro_id = params['id'];
        console.log(this.pro_id);
      });

      this.http.post(`${this.API_Link}/product/editproducts`, {
        id: this.pro_id
      }).subscribe({
        next: (res: any) => {
          this.product.name = res.name;
        },
        error: (error: any) => {
          alert(`${error.error.message}`);
        }
      });
    }
  }
}
