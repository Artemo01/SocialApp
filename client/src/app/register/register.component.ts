import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public cancelRegister = output<boolean>();
  public model: any = {};

  constructor(private readonly accountService: AccountService) {}

  public register(): void {
    this.accountService.register(this.model).subscribe({
      next: (resoinse) => {
        console.log(resoinse);
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }
}
