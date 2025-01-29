import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public registerMode = false;

  constructor() {}

  public registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  public cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
