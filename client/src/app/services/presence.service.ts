import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  public hubsUrl = environment.hubsUrl;
  public onlineUsers = signal<string[]>([]);

  private hubConnection?: HubConnection;

  constructor(private toastr: ToastrService) {}

  public createHubConnection(user: User): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubsUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.toastr.info(username + ' has connected');
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.toastr.warning(username + ' has disconnected');
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) =>
      this.onlineUsers.set(usernames)
    );
  }

  public stopHubConnection(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }
}
