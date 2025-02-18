import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../models/pagination.model';
import { Message } from '../models/message.model';
import {
  setPaginatedResponse,
  setPaginationHeaders,
} from './pagination.helper';
import { Observable, Subscription } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public baseUrl = environment.apiUrl;
  public hubUrl = environment.hubsUrl;
  public paginatedResult = signal<PaginationResult<Message[]> | null>(null);
  public messageThread = signal<Message[]>([]);

  private hubConnection?: HubConnection;

  constructor(private http: HttpClient) {}

  public createHubConnection(user: User, otherUsername: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });
  }

  public stopHubConnection(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  public getMessages(
    pageNumber: number,
    pageSize: number,
    container: string
  ): Subscription {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http
      .get<Message[]>(this.baseUrl + 'messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  public getMessageThread(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      this.baseUrl + 'messages/thread/' + username
    );
  }

  public async sendMessage(username: string, content: string): Promise<any> {
    return this.hubConnection?.invoke('SendMessage', {
      recipientUsername: username,
      content,
    });
  }

  public deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
