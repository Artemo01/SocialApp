import { Component, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../services/likes.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsModule,
    FormsModule,
    MemberCardComponent,
    PaginationModule,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnInit, OnDestroy {
  public predicate = 'liked';
  public pageNumber = 1;
  public pageSize = 5;

  constructor(public likesService: LikesService) {}

  public ngOnInit(): void {
    this.loadLikes();
  }

  public ngOnDestroy(): void {
    this.likesService.paginatedResult.set(null);
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
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  public pageChanged(event: any) {
    if (this.pageNumber != event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
