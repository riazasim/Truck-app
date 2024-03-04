import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';

@Component({
  selector: 'scheduling-send-message',
  templateUrl: './scheduling-send-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingSendMessageComponent {
  @Input() sidenav: MatSidenav;
  @Input() planning$: BehaviorSubject<SchedulingPreviewModel|null>;
  @Output() triggerPlanUpgradeWarning: EventEmitter<void> = new EventEmitter();
}
