import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { Member } from '../../models/member.model';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  public members: Member[] = [];

  constructor(private readonly membersService: MembersService) {}

  public ngOnInit(): void {
    this.loadMembers();
  }

  public loadMembers(): void {
    this.membersService.getMembers().subscribe({
      next: (members) => (this.members = members),
    });
  }
}
