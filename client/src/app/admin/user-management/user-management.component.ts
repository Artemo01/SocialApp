import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  public users: User[] = [];
  public bsModalRef: BsModalRef<RolesModalComponent>;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {
    this.bsModalRef = new BsModalRef<RolesModalComponent>();
  }

  public ngOnInit(): void {
    this.getUsersWithRoles();
  }

  public openRolesModal(user: User) {
    const initailState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'User roles',
        username: user.username,
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: this.users,
        rolesUpdated: false,
      },
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, initailState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService
            .updateUserRoles(user.username, selectedRoles)
            .subscribe({
              next: (roles) => (user.roles = roles),
            });
        }
      },
    });
  }

  public getUsersWithRoles(): void {
    this.adminService.getUserWithRoles().subscribe({
      next: (users) => (this.users = users),
    });
  }
}
