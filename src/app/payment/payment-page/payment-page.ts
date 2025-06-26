import { Component, ChangeDetectorRef } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment-page',
  imports: [HttpClientModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss'
})
export class PaymentPage {

  stripePromise = loadStripe('pk_test_51Re964QDrlAoNSk6lNET5M9pLHMOlkRzg5adEYGy97utyODv6GwLFlzwvh7LFxxaDARqEPFodDg0UO4BOy9LZY6s002k152nvv');

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  async buyProduct() {
    const product = {
      name: 'Cool Headphones',
      price: 4999, // in cents
    };

    this.http.post<any>('http://localhost:3000/api/v1/pay/create-checkout-session', { product })
      .subscribe(async (res) => {
        const stripe = await this.stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: res.id });
        }
        this.cd.detectChanges();
      });
  }

}
