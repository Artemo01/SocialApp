import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if (
    accountService.roles()?.includes('Admin') ||
    accountService.roles()?.includes('Moderator')
  ) {
    return true;
  } else {
    toastr.error('You cannot enter this area');
    return false;
  }
};
