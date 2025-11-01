import { Component, OnInit, ViewEncapsulation, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environments.prod';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductDetails implements OnInit {
  isLoading = false;
  product: any = {};
  admin: any = {};
  id: string = '';
  user: any = {};
  API_Link = environment.apiUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.user = decodedToken;
          if (!this.user.email) {
            alert('User email not found. Please log in again.');
            this.router.navigate(['/login']);
          }
        } catch (error) {
          alert('Invalid token. Please log in again.');
          this.router.navigate(['/login']);
        }
      } else {
        alert('Please log in to view product details.');
        this.router.navigate(['/login']);
      }

      this.loadRazorpayScript();
    }

    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      if (!this.id) {
        alert('Invalid product ID.');
        this.router.navigate(['/']);
        return;
      }

      // ✅ Fetch product only after ID is confirmed
      this.isLoading = true;
      this.http.get<any>(`${this.API_Link}/product/pro-details`, { params: { id: this.id } }).subscribe({
        next: (res: any) => {
          this.product = res.product || {};
          this.admin = res.admin || {};
          if (!this.product.name || typeof this.product.price !== 'number') {
            alert('Product details are incomplete. Please try another product.');
            this.router.navigate(['/']);
            return;
          }
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: (err: any) => {
          console.error('Error loading product details:', err);
          this.isLoading = false;
          alert('Error loading product details');
          this.router.navigate(['/']);
          this.cd.detectChanges();
        }
      });
    });
  }

  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve(false);
        return;
      }
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  getSafeDescription(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.product.description || '');
  }

  async buyProduct() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.user?.email) {
      alert('Please log in to proceed with payment.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product?.name || typeof this.product?.price !== 'number') {
      alert('Product not fully loaded yet. Please wait.');
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    try {
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        throw new Error('Failed to load Razorpay script');
      }

      const payload = {
        product: {
          name: this.product.name,
          price: this.product.price
        },
        email: this.user.email
      };

      console.log('Sending payload to /pay/buynow:', payload);

      const res = await lastValueFrom(
        this.http.post<any>(`${this.API_Link}/pay/buynow`, payload)
      );

      if (!res?.order_id || !res?.key_id || !res?.amount) {
        throw new Error('Invalid Razorpay order response');
      }

      const options = {
        key: res.key_id,
        amount: res.amount * 100,
        currency: res.currency || 'INR',
        name: res.product_name || this.product.name,
        description: `Purchase of ${res.product_name || this.product.name}`,
        order_id: res.order_id,
        handler: (response: any) => {
          console.log('Payment successful:', response);
          this.verifyPayment(response);
        },
        prefill: {
          name: res.name || this.user.name || '',
          email: res.email || this.user.email,
          contact: res.contact || this.user.contact || ''
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: () => {
            this.isLoading = false;
            this.router.navigate(['/cancel']);
            this.cd.detectChanges();
          }
        },
        retry: { enabled: false }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`);
        this.isLoading = false;
        this.router.navigate(['/cancel']);
        this.cd.detectChanges();
      });
      rzp.open();
    } catch (error: any) {
      console.error('Error in Razorpay:', error);
      alert(`Payment error: ${error.message}`);
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  verifyPayment(response: any) {
    this.isLoading = true;
    this.http.post(`${this.API_Link}/pay/verify`, {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert(res.message || 'Payment successful!');
        this.router.navigate(['/success']);
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Verification failed:', err);
        console.log('Payment response for debugging:', response);
        this.isLoading = false;
        alert('Payment verification failed');
        this.router.navigate(['/cancel']);
        this.cd.detectChanges();
      }
    });
  }

  addToCart(productId = this.product._id, quantity: Number = 1) {
    if (!this.user?.id) {
      alert('Please log in to add items to the cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.http.post(`${this.API_Link}/cart/add`, {
      userId: this.user.id,
      productId,
      quantity
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert(res.message);
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Add to cart error:', err);
        this.isLoading = false;
        alert(err.error.message || 'Error adding to cart');
        this.cd.detectChanges();
      }
    });
  }

  view3DModel() {
    alert('3D Model view is not yet implemented.');
  }
}
