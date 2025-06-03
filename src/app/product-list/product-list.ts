import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList {

  pro: any[] = [
    { pro_name: 'White Shoes', pro_loc: 'Thanjavur', categories: 'Toy', pro_price: 3000, pro_img: 'https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-landing-pages/nike/2025/spring/spg25_lp_nike_court_sneakers_45235.jpg', com_logo: 'https://cdn.dribbble.com/userupload/4606170/file/still-fc891139220c3d9edd42f650fe08a62c.png' },
    { pro_name: 'IPhone 13', pro_loc: 'Trichy', categories: 'Clothing', pro_price: 64000, pro_img: 'https://images.moneycontrol.com/static-mcnews/2020/11/apple-iPhone-12-10.png?impolicy=website&width=1600&height=900', com_logo: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg' }
  ];

  constructor(private route: RouterModule) {
  }
  demo_loc: string = '';
  selectedValue = '';
  location: string[] = ['Thanjavur', 'Trichy', 'Coimbatore', 'Kumbakkonam'];
  Filter: any[] = [];
  filter_price: string = '';
  searchTerm = '';
  search() {
    return this.Filter = this.pro.filter(product =>
      product.pro_name.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
      product.pro_loc.toLowerCase().includes(this.demo_loc.toLowerCase())
    );
  }
}
