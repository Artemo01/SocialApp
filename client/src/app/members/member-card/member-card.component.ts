import { Component, computed, input, Signal } from '@angular/core';
import { Member } from '../../models/member.model';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../services/likes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  public member = input.required<Member>();
  public hasLikes: Signal<boolean>;

  constructor(private likeService: LikesService) {
    this.hasLikes = computed(() =>
      this.likeService.likeIds().includes(this.member().id)
    );
  }

  public toogleLike(): void {
    this.likeService.toogleLikes(this.member().id).subscribe({
      next: () => {
        if (this.hasLikes()) {
          this.likeService.likeIds.update((ids) =>
            ids.filter((id) => id !== this.member().id)
          );
        } else {
          this.likeService.likeIds.update((ids) => [...ids, this.member().id]);
        }
      },
    });
  }
}
