import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';
import { StatusListModel } from 'src/app/core/models/status-list.model';

@Component({
  selector: 'app-planning-status-dropdown',
  templateUrl: './planning-status-dropdown.component.html',
  styleUrls: ['./planning-status-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanningStatusDropdownComponent implements OnChanges {
  @Input() planning: SchedulingPreviewModel;
  @Input() statuses: StatusListModel[] = [];

  createdStatus: StatusListModel;
  plannedStatus: StatusListModel;
  rejectedStatus: StatusListModel;
  cancelledStatus: StatusListModel;
  checkedInStatus: StatusListModel;
  checkedOutStatus: StatusListModel;
  hasDropdown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() readonly triggerAccept: EventEmitter<any> =  new EventEmitter<any>();
  @Output() readonly triggerReject: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerCancellation: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerCheckIn: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();
  @Output() readonly triggerCheckOut: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();

  ngOnChanges(): void {
    this.initializeStatuses();
  }

  private initializeStatuses(): void {
    if (this.planning && this.planning.timeSlot && this.planning.dockId && 
      this.planning.status.toLowerCase() !== 'checked-out' && 
      this.planning.status.toLowerCase() !== 'rejected' && 
      this.planning.status.toLowerCase() !== 'cancelled') {
      this.hasDropdown$.next(true);
    }

    if (this.statuses.length) {
      this.statuses.forEach((status: StatusListModel) => {
        switch (status.name.toLowerCase()) {
          case 'created': this.createdStatus = status; break;
          case 'planned': this.plannedStatus = status; break;
          case 'cancelled': this.cancelledStatus = status; break;
          case 'checked-in': this.checkedInStatus = status; break;
          case 'checked-out': this.checkedOutStatus = status; break;
        }
      });
    }
  }
}
