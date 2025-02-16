import { Component, input, output, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
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
  public messages = input.required<Message[]>();
  public messageContent = '';
  public updateMessages = output<Message>();

  constructor(private messageService: MessageService) {}

  public sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .subscribe({
        next: (message) => {
          this.updateMessages.emit(message);
          this.messageForm?.reset();
        },
      });
  }
}
