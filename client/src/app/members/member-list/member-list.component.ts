import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent, PaginationModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  public pageNumber = 1;
  public pageSize = 5;

  constructor(public membersService: MembersService) {}

  public ngOnInit(): void {
    if (!this.membersService.paginatedResult()) this.loadMembers();
  }

  public loadMembers(): void {
    this.membersService.getMembers(this.pageNumber, this.pageSize);
  }

  public pageChanged(event: PageChangedEvent): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
