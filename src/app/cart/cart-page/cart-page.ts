import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environments.prod';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, Navbar, HttpClientModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss'
})
export class CartPage implements OnInit {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  API_Link = environment.apiUrl;
  cartItems: any[] = [];
  quantities = [1, 2, 3];

  ngOnInit(): void {
    this.http.get<any[]>(`${this.API_Link}/product/getproducts`).subscribe({
      next: (res: any) => {
        this.cartItems = res.map((item: any) => ({
          ...item,
          quantity: 1
        }));
        this.cd.detectChanges();
      },
      error: (error: any) => {
        alert(`${error.error.message}`);
      }
    });
    this.getTotal();
  }

  couponCode = '';

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeItem(itemToRemove: any): void {
    this.cartItems = this.cartItems.filter(item => item !== itemToRemove);
  }

  applyCoupon(): void {
    alert(`Coupon "${this.couponCode}" applied!`);
  }

}
