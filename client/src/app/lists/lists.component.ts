import { Component, OnInit } from '@angular/core';
import { LikesService } from '../services/likes.service';
import { Member } from '../models/member.model';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, ButtonsModule, FormsModule, MemberCardComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnInit {
  public members: Member[] = [];
  public predicate = 'liked';

  constructor(private likesService: LikesService) {}

  public ngOnInit(): void {
    this.loadLikes();
  }

  public getTitle() {
    switch (this.predicate) {
      case 'liked':
        return 'Members you like';
      case 'likedBy':
        return 'Members who like you';
      default:
        return 'Mutual';
    }
  }

  public loadLikes(): void {
    this.likesService.getLikes(this.predicate).subscribe({
      next: (members) => (this.members = members),
    });
  }
}
