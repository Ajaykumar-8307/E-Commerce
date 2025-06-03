import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { ProductList } from '../product-list/product-list';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, ProductList],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage {

}
