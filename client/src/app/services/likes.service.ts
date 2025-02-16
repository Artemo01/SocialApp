import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member.model';
import { Observable, Subscription } from 'rxjs';
import { PaginationResult } from '../models/pagination.model';
import {
  setPaginatedResponse,
  setPaginationHeaders,
} from './pagination.helper';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  public baseUrl = environment.apiUrl;
  public likeIds = signal<number[]>([]);
  public paginatedResult = signal<PaginationResult<Member[]> | null>(null);

  constructor(private http: HttpClient) {}

  public toogleLikes(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  public getLikes(
    predicate: string,
    pageNumber: number,
    pageSize: number
  ): Subscription {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.http
      .get<Member[]>(`${this.baseUrl}likes`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          setPaginatedResponse(response, this.paginatedResult),
      });
  }

  public getLikeIds(): Subscription {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: (ids) => this.likeIds.set(ids),
    });
  }
}
