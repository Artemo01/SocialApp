import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member.model';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  public baseUrl = environment.apiUrl;
  public likeIds = signal<number[]>([]);

  constructor(private http: HttpClient) {}

  public toogleLikes(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  public getLikes(predicate: string): Observable<Member[]> {
    return this.http.get<Member[]>(
      `${this.baseUrl}likes?predicate=${predicate}`
    );
  }

  public getLikeIds(): Subscription {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: (ids) => this.likeIds.set(ids),
    });
  }
}
