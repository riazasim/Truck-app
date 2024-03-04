import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-menu',
  templateUrl: './vehicle-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleMenuComponent {
  constructor(public readonly route: ActivatedRoute) {}
}
