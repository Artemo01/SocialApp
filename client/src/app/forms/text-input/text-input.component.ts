import { CommonModule } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor {
  public label = input<string>('');
  public type = input<string>('text');

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  public writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {}

  public registerOnTouched(fn: any): void {}

  public get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
