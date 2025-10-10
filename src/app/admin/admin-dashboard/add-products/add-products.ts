import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  aiGenerated = false;

  token: any;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
  ) { }

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

  aigenerateDescription() {
    this.http.post(`http://localhost:3000/api/v1/gemini/product-description`, {
      prompt: this.product.description,
      name: this.product.name,
      cato: this.product.category
    }).subscribe({
      next: (res: any) => {
        this.product.description = res.text;
        this.aiGenerated = true;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error:', err);
      }
    });
  }

  onDescriptionChange(event: Event) {
    const element = event.target as HTMLElement;
    this.product.description = element.innerHTML;
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

    // Either file OR URL for product image
    if (this.productImage) {
      formData.append('productImage', this.productImage);
    } else if (this.product.productImageUrl) {
      formData.append('productImageUrl', this.product.productImageUrl);
    }

    // Either file OR URL for company logo
    if (this.companyLogo) {
      formData.append('companyLogo', this.companyLogo);
    } else if (this.product.companyLogoUrl) {
      formData.append('companyLogoUrl', this.product.companyLogoUrl);
    }

    this.http.post(`${this.API_Link}/product/addproducts`, formData).subscribe({
      next: (res: any) => {
        alert('Product added successfully');
        this.product = {};
        this.productImage = null;
        this.companyLogo = null;
        window.location.reload();
      },
      error: (err: any) => {
        alert(`Error: ${err.error.message}`);
      }
    });
  }
}
