import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member.model';
import { Observable, of, Subscription, tap } from 'rxjs';
import { PaginationResult } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = environment.apiUrl;
  public paginatedResult = signal<PaginationResult<Member[]> | null>(null);

  constructor(private readonly http: HttpClient) {}

  public getMembers(pageNumber?: number, pageSize?: number): Subscription {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return this.http
      .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .subscribe({
        next: (response) => {
          this.paginatedResult.set({
            items: response.body as Member[],
            pagination: JSON.parse(response.headers.get('Pagination')!),
          });
        },
      });
  }

  public getMember(username: string): Observable<Member> {
    // const member = this.members().find((member) => member.username == username);
    // if (member != null) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  public updateMember(member: Member): Observable<Object> {
    return this.http
      .put(this.baseUrl + 'users', member)
      .pipe
      // tap(() =>
      //   this.members.update((members) =>
      //     members.map((m) => (m.username == member.username ? member : m))
      //   )
      // )
      ();
  }
}
