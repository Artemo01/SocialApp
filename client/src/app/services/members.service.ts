import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {
  Injectable,
  model,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member.model';
import { Observable, of, Subscription, tap } from 'rxjs';
import { PaginationResult } from '../models/pagination.model';
import { UserParams } from '../models/userParams.model';
import { AccountService } from './account.service';
import { User } from '../models/user.model';
import {
  setPaginatedResponse,
  setPaginationHeaders,
} from './pagination.helper';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = environment.apiUrl;
  public paginatedResult = signal<PaginationResult<Member[]> | null>(null);
  public userParams: WritableSignal<UserParams>;
  public memberCache = new Map();
  public user: User | null;

  constructor(
    private readonly http: HttpClient,
    private readonly accountService: AccountService
  ) {
    this.user = this.accountService.currentUser();
    this.userParams = signal<UserParams>(new UserParams(this.user));
  }

  public resetUserParams(): void {
    this.userParams.set(new UserParams(this.user));
  }

  public getMembers(): void | Subscription {
    const response = this.memberCache.get(
      Object.values(this.userParams()).join('-')
    );

    if (response) return setPaginatedResponse(response, this.paginatedResult);

    let params = setPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize
    );

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http
      .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .subscribe({
        next: (response) => {
          setPaginatedResponse(response, this.paginatedResult);
          this.memberCache.set(
            Object.values(this.userParams()).join('-'),
            response
          );
        },
      });
  }

  public getMember(username: string): Observable<Member> {
    const member: Member = [...this.memberCache.values()]
      .reduce((array, element) => array.concat(element.body), [])
      .find((m: Member) => m.username === username);

    if (member) return of(member);

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
