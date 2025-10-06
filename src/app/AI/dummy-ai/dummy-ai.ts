import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dummy-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dummy-ai.html',
  styleUrls: ['./dummy-ai.scss']
})
export class DummyAi {

  productName = '';
  description = '';
  isLoading = false;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  generateDescription() {
    if (!this.productName && !this.selectedFile) return;

    this.isLoading = true;
    this.description = '';

    this.http.post('http://localhost:3000/api/v1/gemini', {
      prompt: this.productName
    })
      .subscribe({
        next: (res: any) => {
          this.description = res.text;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: (err: any) => {
          console.error('Error:', err);
          this.zone.run(() => { this.isLoading = false; });
          this.cd.detectChanges();
        }
      });
  }


  refresh() {
    this.isLoading = false;
  }
}
