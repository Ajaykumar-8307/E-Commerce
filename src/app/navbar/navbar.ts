import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Navbar {
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  categories: string[] = ['Food', 'Electronics', 'Dress', 'FootWear'];
  pro_cat: string = '';
  user: any;
}
