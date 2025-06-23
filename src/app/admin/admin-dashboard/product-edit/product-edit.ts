import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environments.prod';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss'
})
export class ProductEdit implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private location: Location
  ) { }

  pro_id: string = '';

  product: any = {};

  productImage: File | null = null;
  companyLogo: File | null = null;

  API_Link = environment.apiUrl;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.route.queryParams.subscribe((params) => {
        this.pro_id = params['id'];
        console.log(this.pro_id);
      });

      this.http.post(`${this.API_Link}/product/updateproduct`, { id: this.pro_id })
        .subscribe((res: any) => {
          this.product = res.product;
          console.log(res.product);
          this.cd.detectChanges();
        });
    }
  }

  onFileChange(event: any, type: 'product' | 'logo') {
    const file = event.target.files[0];
    if (type === 'product') this.productImage = file;
    if (type === 'logo') this.companyLogo = file;
  }

  onUpdateProduct() {
    const formData = new FormData();
    formData.append('id', this.pro_id);

    // Append product details
    for (const key in this.product) {
      if (
        this.product[key] !== undefined &&
        this.product[key] !== null &&
        key !== 'image' &&
        key !== 'com_logo'
      ) {
        formData.append(key, this.product[key]);
      }
    }

    // Append image file or URL
    if (this.productImage) {
      formData.append('productImage', this.productImage);
    } else if (this.product.productImageUrl) {
      formData.append('productImageUrl', this.product.productImageUrl);
    }

    if (this.companyLogo) {
      formData.append('companyLogo', this.companyLogo);
    } else if (this.product.companyLogoUrl) {
      formData.append('companyLogoUrl', this.product.companyLogoUrl);
    }

    this.http.post(`${this.API_Link}/product/updateproduct`, formData).subscribe({
      next: (res: any) => {
        alert(`${res.message}`);
        this.goback();
      },
      error: (err) => {
        alert(`${err.error.message}`);
        console.error(err);
      }
    });
  }

  goback() {
    this.location.back();
  }
}
