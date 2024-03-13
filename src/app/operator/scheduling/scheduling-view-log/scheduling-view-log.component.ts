import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { OpenImageModalComponent } from 'src/app/shared/components/open-image-modal/open-image-modal.component';

@Component({
  selector: 'scheduling-view-log',
  templateUrl: './scheduling-view-log.component.html',
  styleUrls: ['./scheduling-view-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingViewLogComponent implements OnChanges {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() id: number;
  @Input() sidenav: MatSidenav;
  @Input() planning$: BehaviorSubject<any|null>;
  planning: any;
  shipmentLogs: any[];

  constructor(private readonly planningService: PlanningService,
              private readonly dialog: MatDialog) {}

  ngOnChanges(): void {
    this.retrieveLogHistory();
  }

  openImageModal(image: string): void {
    this.dialog.open(OpenImageModalComponent, {
      data: image
    });
  }

  retrieveLogHistory(): void {
    this.isLoading$.next(true);
    this.planningService.listLogs(this.id).subscribe((response: any[]) => {
      this.planning = {...response[0]};
      this.shipmentLogs = (<any[]>{...response[0]}.shipmentLogs);
      this.isLoading$.next(false);
    })
  }
}

