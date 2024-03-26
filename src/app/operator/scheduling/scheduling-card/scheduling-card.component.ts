import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { PlanningModel } from 'src/app/core/models/planning.model';
import { PlanningService } from 'src/app/core/services/planning.service';
import { BehaviorSubject } from 'rxjs';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'scheduling-card',
    templateUrl: './scheduling-card.component.html',
    styleUrls: ['./scheduling-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingCardComponent {
    @Input() planning: PlanningModel;
    // @Input() planning: SchedulingPreviewModel;
    @Input() isUmexOrganization: boolean | null;
    @Input() isMaxWidth: boolean;
    @Input() isloading: BehaviorSubject<boolean>;
    @Output() readonly triggerSideNav = new EventEmitter<{ view: string, id: number, sId: number , modal : string}>();
    @Output() readonly triggerDeletion: EventEmitter<PlanningModel | null> = new EventEmitter<PlanningModel | null>();
    @Output() readonly triggerCancellation: EventEmitter<PlanningModel> = new EventEmitter<PlanningModel>();
    @Output() readonly triggerReject: EventEmitter<PlanningModel> = new EventEmitter<PlanningModel>();
    @Output() readonly triggerAccept: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly triggerCheckIn: EventEmitter<PlanningModel> = new EventEmitter<PlanningModel>();
    @Output() readonly triggerCheckOut: EventEmitter<PlanningModel> = new EventEmitter<PlanningModel>();
    @Input() statuses: StatusListModel[] = [];

    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    plannings: any[] = [];
    originalSource: any[] = [];
    pageIndex: number;
    pageSize: number;
    length: number;

    constructor(private readonly clipboard: Clipboard,
        private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly cd: ChangeDetectorRef) {
          this.retrievePlanningList();
         }

    retrievePlanningList(): void {

        this.pageIndex=0;
        this.pageSize=0;

        let data={
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.planningService.pagination(data).subscribe((response:any) => {
            this.plannings = response.items;
            this.originalSource = response.items;
            this.length=response.noTotal;
            this.isLoading$.next(false)
            this.cd.detectChanges();
        })
    }

    openDeleteModal(id: number = -1) {
        this.dialogService.open(SchedulingDeleteModalComponent, {
            disableClose: true,
            data: { "id": id, "title": "planning" }
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.planningService.delete(id).subscribe(() => {
                            this.retrievePlanningList();
                            this.cd.detectChanges();
                        })
                    }
                }
            });
    }

    setComponentName(value: string): void {

        if (value === 'copy') this.clipboard.copy(this.planning.id + '');
        this.triggerSideNav.emit({ view: value, id: <number>this.planning.id, sId: <number>this.planning.sId , modal : 'shipment' });
    }

    // showProducts(): string {
    //     return this.planning.products.length ? (<SchedulingProduct[]>this.planning.products).map(p => p.productName).join(', ') : '-';
    // }

    handleTriggerAction(planning: PlanningModel): void {
    //     if (planning.status.toLowerCase() === 'created') {
    //         this.triggerReject.emit(planning);
    //     }

    //     if (planning.status.toLowerCase() === 'planned' || planning.status.toLowerCase() === 'checked-in') {
    //         this.triggerCancellation.emit(planning);
    //     }
    }
}
