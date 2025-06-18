import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environments.prod';

@Component({
  selector: 'app-add-products',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-products.html',
  styleUrl: './add-products.scss'
})
export class AddProducts implements OnInit {

  API_Link = environment.apiUrl;

  product: any = {
    name: '',
    category: '',
    price: '',
    stocks: '',
    location: '',
    description: '',
    adminId: ''
  };

  productImage: File | null = null;
  companyLogo: File | null = null;

  token: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      const decodedToken: any = jwtDecode(this.token);
      this.product.adminId = decodedToken.id;
    }
  }

  onFileSelected(event: Event, field: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (field === 'productImage') this.productImage = file;
      else if (field === 'companyLogo') this.companyLogo = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('category', this.product.category);
    formData.append('price', this.product.price);
    formData.append('stocks', this.product.stocks);
    formData.append('location', this.product.location);
    formData.append('description', this.product.description);
    formData.append('adminId', this.product.adminId);
    if (this.productImage) formData.append('productImage', this.productImage);
    if (this.companyLogo) formData.append('companyLogo', this.companyLogo);

    this.http.post(`${this.API_Link}/product/addproducts`, formData).subscribe({
      next: (res: any) => {
        alert('Product added successfully');
        this.product = {};
        window.location.reload();
      },
      error: (err: any) => {
        alert(`Error: ${err.error.message}`);
      }
    });
  }
}
