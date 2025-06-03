import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.scss']
})
export class Carousel {
  images = [
    'https://graphicsfamily.com/wp-content/uploads/edd/2022/12/E-commerce-Product-Banner-Design-scaled.jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/627ab1121502531.60c775945f4bf.png',
    'https://img.freepik.com/free-psd/black-friday-super-sale-web-banner-template_120329-3861.jpg?semt=ais_items_boosted&w=740'
  ];

  currentIndex = 0;

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }
}
