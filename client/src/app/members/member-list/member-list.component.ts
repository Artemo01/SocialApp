import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../services/account.service';
import { UserParams } from '../../models/userParams.model';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
    MemberCardComponent,
    PaginationModule,
    FormsModule,
    ButtonsModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  public genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(public membersService: MembersService) {}

  public ngOnInit(): void {
    if (!this.membersService.paginatedResult()) this.loadMembers();
  }

  public loadMembers(): void {
    this.membersService.getMembers();
  }

  public resetFilters(): void {
    this.membersService.resetUserParams();
    this.loadMembers();
  }

  public pageChanged(event: PageChangedEvent): void {
    if (this.membersService.userParams().pageNumber !== event.page) {
      this.membersService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}
