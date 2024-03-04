import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { SchedulingPreviewModel, SchedulingProduct } from 'src/app/core/models/scheduling.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { StatusListModel } from 'src/app/core/models/status-list.model';

@Component({
  selector: 'scheduling-card',
  templateUrl: './scheduling-card.component.html',
  styleUrls: ['./scheduling-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingCardComponent {
  @Input() planning: SchedulingPreviewModel;
  @Input() isUmexOrganization: boolean|null;
  @Input() isMaxWidth: boolean;
  @Output() readonly triggerSideNav =  new EventEmitter<{ view: string, id: number, sId: number }>();
  @Output() readonly triggerDeletion: EventEmitter<SchedulingPreviewModel|null> =  new EventEmitter<SchedulingPreviewModel|null>();
  @Output() readonly triggerCancellation: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerReject: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerAccept: EventEmitter<any> =  new EventEmitter<any>();
  @Output() readonly triggerCheckIn: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();
  @Output() readonly triggerCheckOut: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();
  @Input() statuses: StatusListModel[] = [];

  constructor(private readonly clipboard: Clipboard) {}

  setComponentName(value: string): void {
    if (value === 'copy') this.clipboard.copy(this.planning.sId+'');
    this.triggerSideNav.emit({ view: value, id: <number>this.planning.id, sId: <number>this.planning.sId });
  }

  showProducts(): string {
    return this.planning.products.length ?  (<SchedulingProduct[]>this.planning.products).map(p => p.productName).join(', ') : '-';
  }

  handleTriggerAction(planning: SchedulingPreviewModel): void {
    if (planning.status.toLowerCase() === 'created') {
      this.triggerReject.emit(planning);
    }

    if (planning.status.toLowerCase() === 'planned' || planning.status.toLowerCase() === 'checked-in') {
      this.triggerCancellation.emit(planning);
    }
  }
}
