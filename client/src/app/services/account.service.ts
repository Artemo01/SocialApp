import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = environment.apiUrl;

  public currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private likesService: LikesService) {}

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public register(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  public setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
}
