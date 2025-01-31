import { CommonModule } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../services/account.service';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { DatePicketComponent } from '../forms/date-picket/date-picket.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    DatePicketComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public cancelRegister = output<boolean>();
  public form: FormGroup = new FormGroup({});
  public maxDate = new Date();
  public validationErrors: string[] | undefined;

  constructor(
    private readonly accountService: AccountService,
    private readonly builder: FormBuilder,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.initialize();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  public register(): void {
    const dob = this.getDateOnly(this.form.get('dateOfBirth')?.value);
    this.form.patchValue({ dateOfBirth: dob });

    this.accountService.register(this.form.value).subscribe({
      next: (_) => this.router.navigateByUrl('/members'),
      error: (error) => (this.validationErrors = error),
    });
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

  private initialize(): void {
    this.initializeForm();
    this.subscribeForPasswordChanges();
  }

  private initializeForm(): void {
    this.form = this.builder.group({
      gender: ['male'],
      username: [null, Validators.required],
      knownAs: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(4)]],
      confirmPassword: [
        null,
        [Validators.required, this.matchValues('password')],
      ],
    });
  }

  private subscribeForPasswordChanges(): void {
    this.form.controls['password'].valueChanges.subscribe({
      next: () =>
        this.form.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value == control.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  }
}
