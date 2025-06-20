import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss'
})
export class CartPage {

  cartItems = [
    {
      name: "Men's Casual Shirt",
      price: 999,
      quantity: 1,
      image: 'https://res.cloudinary.com/djrnozthb/image/upload/v1750328005/products/tqis0hh8wuyis4uuldxi.jpg'
    },
    {
      name: "Women's Sneakers",
      price: 1499,
      quantity: 1,
      image: 'https://res.cloudinary.com/djrnozthb/image/upload/v1750328005/products/tqis0hh8wuyis4uuldxi.jpg'
    }
  ];

  quantities = [1, 2, 3];
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
