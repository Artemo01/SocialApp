import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../models/member.model';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { PresenceService } from '../../services/presence.service';
import { AccountService } from '../../services/account.service';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    GalleryModule,
    TimeagoModule,
    MemberMessagesComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  public member: Member = {} as Member;
  public images: GalleryItem[] = [];
  public activeTab?: TabDirective;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly accountService: AccountService,
    private readonly router: Router,
    public presenceService: PresenceService
  ) {}

  public ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];
        this.member &&
          this.member.photos.map((photo) => {
            this.images.push(
              new ImageItem({ src: photo.url, thumb: photo.url })
            );
          });
      },
    });

    this.route.paramMap.subscribe({
      next: (_) => this.onRouterParamsChange(),
    });

    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
  }

  public ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  public selectTab(heaing: string): void {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(
        (tab) => tab.heading === heaing
      );
      if (messageTab) messageTab.active = true;
    }
  }

  public onRouterParamsChange() {
    const user = this.accountService.currentUser();
    if (!user) return;
    if (
      this.messageService.hubConnection?.state ===
        HubConnectionState.Connected &&
      this.activeTab?.heading === 'Messages'
    ) {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username);
      });
    }
  }

  public onTabActibated(data: TabDirective): void {
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activeTab.heading },
      queryParamsHandling: 'merge',
    });
    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if (!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
