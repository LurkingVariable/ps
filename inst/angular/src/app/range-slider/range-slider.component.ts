import { Component, Directive, Input, Output, ContentChild, TemplateRef, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PaletteService } from '../palette.service';

@Directive({selector: 'ng-template[rsLabel]'})
export class RangeSliderLabel {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: 'ng-template[rsHelp]'})
export class RangeSliderHelp {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ]
})
export class RangeSliderComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() name: string;
  @Input() min: number;
  @Input() max: number;
  @Input() step = 0.01;
  @Input('hard-min') hardMin: number;
  @Input('hard-max') hardMax: number;
  @Input('is-output') isOutput = false;
  @Input('can-add') canAdd = true;
  @Input('can-remove') canRemove = false;
  @Input('palette-color') paletteColor = -1;
  @Output('add') onAdd = new EventEmitter<string>();
  @Output('remove') onRemove = new EventEmitter<string>();
  value: number;
  private changeCallback: any;

  @ContentChild(RangeSliderLabel) labelTpl: RangeSliderLabel;
  @ContentChild(RangeSliderHelp) helpTpl: RangeSliderHelp;

  constructor(public palette: PaletteService) { }

  ngOnInit() {
  }

  floor(n: number): number {
    return Math.floor(n);
  }

  ceil(n: number): number {
    return Math.ceil(n);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  rangeChanged(newValue: string): void {
    this.value = parseFloat(newValue);
    this.propagateChange();
  }

  rangeInput(newValue: string): void {
    this.value = parseFloat(newValue);
  }

  numberChanged(newValue: string): void {
    this.value = parseFloat(newValue);
    this.propagateChange();
  }

  numberInput(newValue: string): void {
    this.value = parseFloat(newValue);
  }

  add(): void {
    this.onAdd.emit(this.name);
  }

  remove(): void {
    this.onRemove.emit(this.name);
  }

  private propagateChange(): void {
    if (this.changeCallback) {
      this.changeCallback(this.value);
    }
  }
}
