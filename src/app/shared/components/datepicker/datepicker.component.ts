import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() placeholder: string = 'Pick a date';

  @Input() height: number;
  @Input() isHeaderPosition: boolean;

  @Input() model: string | Date;

  @Input() textAlign: string;

  @Output() dateChanged: EventEmitter<string|Date> = new EventEmitter<string|Date>();

  styles: any = {};
  constructor() { }

  ngOnInit(): void {
    if (this.height) {
      this.styles = {
        minHeight: 'auto',
        height: `${this.height}px`
      }
    }

    if (this.isHeaderPosition) {
      this.styles['borderRadius'] = '5px';
    }
  }
}
