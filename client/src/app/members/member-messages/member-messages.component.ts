import { Component, input, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss',
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  public username = input.required<string>();
  public messageContent = '';

  constructor(public messageService: MessageService) {}

  public sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .then(() => this.messageForm?.reset());
  }
}
