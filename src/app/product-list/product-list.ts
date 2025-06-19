import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environments.prod';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {
  pro: any[] = [];
  API_Link = environment.apiUrl;
  demo_loc: string = '';
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  Filter: any[] = [];
  filter_price: string = '';
  searchTerm = '';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    // Add cache-busting query parameter
    this.http.get<any[]>(`${this.API_Link}/product/getproducts?_=${Date.now()}`).subscribe({
      next: (data: any) => {
        this.pro = data;
        this.Filter = data; // Initialize Filter with all products
        this.cd.detectChanges();
      },
      error: (error: any) => {
        alert(error?.error?.message || 'Failed to fetch products');
      }
    });
  }

  search() {
    this.Filter = this.pro.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.demo_loc || product.location.toLowerCase().includes(this.demo_loc.toLowerCase()))
    );
    return this.Filter;
  }

  onImageError(event: Event) {
    console.error('Image failed to load:', (event.target as HTMLImageElement).src);
    // Optional: Set a fallback image
    (event.target as HTMLImageElement).src = 'assets/fallback-image.jpg';
  }

  navToDetails(product: any){
    this.router.navigate(['/products'], { queryParams: { id: product._id } });
  }

  print(){
    console.log("Hello");
  }
}