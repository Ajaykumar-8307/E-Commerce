import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environments.prod';
import { ChangeDetectorRef } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-product-details',
  imports: [Navbar, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductDetails implements OnInit {

  stripePromise = loadStripe('pk_test_51Re964QDrlAoNSk6lNET5M9pLHMOlkRzg5adEYGy97utyODv6GwLFlzwvh7LFxxaDARqEPFodDg0UO4BOy9LZY6s002k152nvv');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  API_Link = environment.apiUrl;

  product: any = {};
  admin: any = {};
  id: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    this.http.get<any[]>(`${this.API_Link}/product/pro-details`, { params: { id: this.id } }).subscribe({
      next: (res: any) => {
        this.product = res.product;
        this.admin = res.admin;
        this.cd.detectChanges();
        console.log(res);
      }
    });
  }

  async buyProduct() {

    this.http.post<any>(`${this.API_Link}/pay/create-checkout-session`, { product: this.product })
      .subscribe(async (res) => {
        alert(res.message);
        const stripe = await this.stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: res.id });
        }
        this.cd.detectChanges();
      });
  }

}
