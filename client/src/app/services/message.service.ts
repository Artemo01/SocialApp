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

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public baseUrl = environment.apiUrl;
  public paginatedResult = signal<PaginationResult<Message[]> | null>(null);

  constructor(private http: HttpClient) {}

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

  public sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientUsername: username,
      content,
    });
  }

  public deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
