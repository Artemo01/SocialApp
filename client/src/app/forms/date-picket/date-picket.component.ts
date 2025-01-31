import { CommonModule } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picket',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule],
  templateUrl: './date-picket.component.html',
  styleUrl: './date-picket.component.scss',
})
export class DatePicketComponent implements ControlValueAccessor {
  public label = input<string>('');
  public maxDate = input<Date>();
  public bsConfig?: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY',
    };
  }

  public writeValue(obj: any): void {}
  public registerOnChange(fn: any): void {}
  public registerOnTouched(fn: any): void {}

  public get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
