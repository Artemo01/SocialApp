import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public title = 'SocialApp';
  public users: any;

  constructor(private httpClient: HttpClient) {}

  public ngOnInit(): void {
    this.httpClient.get('https://localhost:44310/api/users').subscribe({
      next: (resposne) => (this.users = resposne),
      error: (error) => console.log(error),
      complete: () => console.log('Request has completed'),
    });
  }
}
