import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.scss',
})
export class RolesModalComponent {
  public title = '';
  public username = '';
  public availableRoles: string[] = [];
  public selectedRoles: string[] = [];
  public rolesUpdated = false;

  constructor(public bsModalRef: BsModalRef) {}

  public uppdateChecked(checkedValue: string): void {
    if (this.selectedRoles.includes(checkedValue)) {
      this.selectedRoles = this.selectedRoles.filter(
        (role) => role !== checkedValue
      );
    } else {
      this.selectedRoles.push(checkedValue);
    }
  }

  public onSelectRoles(): void {
    this.rolesUpdated = true;
    this.bsModalRef.hide();
  }
}
