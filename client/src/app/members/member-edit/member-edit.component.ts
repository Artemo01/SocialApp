import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../models/member.model';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, TabsModule, FormsModule, TimeagoModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  public member?: Member;

  constructor(
    private readonly accountService: AccountService,
    private readonly memberService: MembersService,
    private readonly toastrService: ToastrService
  ) {}

  public ngOnInit(): void {
    this.loadMember();
  }

  public updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastrService.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      },
    });
  }

  private loadMember(): void {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }
}
