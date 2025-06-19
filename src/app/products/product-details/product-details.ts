import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environments.prod';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [Navbar, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductDetails implements OnInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ){}

  API_Link = environment.apiUrl;

  product: any= {};
  id: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    this.http.get<any[]>(`${this.API_Link}/product/pro-details`, { params: { id: this.id } }).subscribe({
      next: (res: any) => {
        this.product = res;
        this.cd.detectChanges();
        console.log(res);
      }
    });
  }

}
