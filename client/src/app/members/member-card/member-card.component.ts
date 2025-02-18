import { Component, computed, input, Signal } from '@angular/core';
import { Member } from '../../models/member.model';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../services/likes.service';
import { CommonModule } from '@angular/common';
import { PresenceService } from '../../services/presence.service';

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
  public isOnline: Signal<boolean>;

  constructor(
    private likeService: LikesService,
    private presenceService: PresenceService
  ) {
    this.hasLikes = computed(() =>
      this.likeService.likeIds().includes(this.member().id)
    );

    this.isOnline = computed(() =>
      this.presenceService.onlineUsers().includes(this.member().username)
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
