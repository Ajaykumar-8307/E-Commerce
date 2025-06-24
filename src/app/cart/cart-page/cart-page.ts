import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environments.prod';
import { ChangeDetectorRef } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, Navbar, HttpClientModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss'
})
export class CartPage implements OnInit {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  API_Link = environment.apiUrl;
  cartItems: any;
  quantities = [1, 2, 3];
  userId = '';

  ngOnInit(): void {
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('token');
      if(token){
        const decodedToken: any = jwtDecode(token);
        this.userId = decodedToken.id;
        this.cd.detectChanges();
      }
      this.loadProducts();
    }
  }

  couponCode = '';

  loadProducts(){
    this.http.get<any[]>(`${this.API_Link}/cart/${this.userId}`).subscribe({
      next: (res: any) => {
        this.cartItems = res;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        alert(`${error.error.message}`);
      }
    })
  }

  removeProduct(productId: any){
    this.http.post(`${this.API_Link}/cart/remove`, {
      userId: this.userId,
      productId
    }).subscribe({
      next: (res: any) => {
        alert(`${res.message}`);
        this.loadProducts();
      },
      error: (err: any) => {
        alert(`${err.error.message}`);
      }
    });
  }

  applyCoupon(): void {
    alert(`Coupon "${this.couponCode}" applied!`);
  }

}
