import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit{

  pro: any[] = [];

  API_Link = 'https://e-commerce-bmp5.onrender.com/api/v1/product';

  constructor(private route: RouterModule, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${this.API_Link}/getproducts`).subscribe({
      next: (data: any) => {
        this.pro = data;
      },
      error: (error: any) => {
      alert(`${error.error.message}`);
      }
    });
  }
  demo_loc: string = '';
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  Filter: any[] = [];
  filter_price: string = '';
  searchTerm = '';
  search() {
    return this.Filter = this.pro.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
      product.location.toLowerCase().includes(this.demo_loc.toLowerCase())
    );
  }
}
