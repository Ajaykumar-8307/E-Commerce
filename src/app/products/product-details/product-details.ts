import { Component, ViewEncapsulation } from '@angular/core';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-product-details',
  imports: [Navbar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductDetails {

}
