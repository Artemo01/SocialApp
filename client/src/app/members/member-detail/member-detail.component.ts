import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member.model';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, TabsModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent implements OnInit {
  public member?: Member;

  constructor(
    private readonly memberService: MembersService,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.loadMember();
  }

  public loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: (member) => (this.member = member),
    });
  }
}
