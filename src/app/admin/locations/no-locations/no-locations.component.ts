import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-locations',
  templateUrl: './no-locations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoLocationsComponent {}
