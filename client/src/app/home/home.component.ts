import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public registerMode = false;
  public users: any;

  constructor(private httpClient: HttpClient) {}

  public ngOnInit(): void {
    this.getUsers();
  }

  public registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  public cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }

  private getUsers(): void {
    this.httpClient.get('https://localhost:44310/api/users').subscribe({
      next: (resposne) => (this.users = resposne),
      error: (error) => console.log(error),
      complete: () => console.log('Request has completed'),
    });
  }
}
