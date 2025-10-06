import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { ProductList } from '../product-list/product-list';
import { Carousel } from '../carousel/carousel';
import { DummyAi } from '../AI/dummy-ai/dummy-ai';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environments.prod';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, RouterModule, Navbar, ProductList, Carousel, DummyAi, HttpClientModule],
  standalone: true,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private zone: NgZone) { }

  description: string = '';
  content: string = '';
  conversation: { role: string; content: { text: string }[] }[] = [];
  isLoading: boolean = false;

  API_LINK = environment.apiUrl;

  generateDescription() {
    if (!this.description.trim()) return;

    const userInput = this.description; // Capture the input before clearing

    // Add user message to conversation
    this.conversation.push({
      role: 'user',
      content: [{ text: userInput }]
    });

    this.description = ''; // Clear the input after capturing

    this.zone.run(() => {
      this.isLoading = true;
      this.cd.detectChanges(); // Ensure UI updates immediately
    });

    this.http.post(`${this.API_LINK}/gemini`, {
      prompt: userInput,
      conversation: this.conversation
    }).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          // Add assistant message
          this.conversation.push({
            role: 'assistant',
            content: [{ text: res.text }]
          });

          this.content = res.text;   // Update bound variable
          this.isLoading = false;
          this.cd.detectChanges(); // Update the UI
          console.log(this.content);
        });
      },
      error: (err) => {
        console.error(err);
        this.zone.run(() => this.isLoading = false);
      }
    });
  }
}