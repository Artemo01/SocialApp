import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member.model';
import { Observable, of, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = environment.apiUrl;
  public members = signal<Member[]>([]);

  constructor(private readonly http: HttpClient) {}

  public getMembers(): Subscription {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: (members) => this.members.set(members),
    });
  }

  public getMember(username: string): Observable<Member> {
    const member = this.members().find((member) => member.username == username);
    if (member != null) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  public updateMember(member: Member): Observable<Object> {
    return this.http
      .put(this.baseUrl + 'users', member)
      .pipe(
        tap(() =>
          this.members.update((members) =>
            members.map((m) => (m.username == member.username ? member : m))
          )
        )
      );
  }
}
