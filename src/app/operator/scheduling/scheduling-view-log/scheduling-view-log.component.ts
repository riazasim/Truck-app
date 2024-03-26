import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { OpenImageModalComponent } from 'src/app/shared/components/open-image-modal/open-image-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleSuccess } from 'src/app/shared/utils/success-handling.function';
import { handleError } from 'src/app/shared/utils/error-handling.function';

@Component({
    selector: 'scheduling-view-log',
    templateUrl: './scheduling-view-log.component.html',
    styleUrls: ['./scheduling-view-log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideOut', [
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
            ])
        ])
    ]
})
export class SchedulingViewLogComponent implements OnChanges {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() id: number;
    @Input() modal: string;
    @Input() sidenav: MatSidenav;
    @Input() planning$: BehaviorSubject<any | null>;
    userId: number = -1;
    planning: any;
    shipmentLogs: any[];
    step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    displayedColumns: string[] = ['select', 'name'];
    transferData: any[];
    dataSource: MatTableDataSource<any>
    selection: any;


    constructor(private readonly planningService: PlanningService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar
    ) { }

    ngOnChanges(): void {
        this.retrieveLogHistory();
    }

    openImageModal(image: string): void {
        this.dialog.open(OpenImageModalComponent, {
            data: image
        });
    }
    onRoleSelect(userRole: string): void {
        this.isLoading$.next(true)
        const userRoleData = {
            "start": 0,
            "length": 0,
            "filters": ["", "", userRole, "", ""],//["firstname/lastname", "status", "useRole", "phone", "email"]  //'ROLE_USER_AGENT','ROLE_USER_MANEUVERING','ROLE_USER_CAPTAIN'
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.planningService.getTransferData(userRoleData).subscribe((response: any) => {
            this.isLoading$.next(false)
            this.step$.next(2)
            this.transferData = response.items
            this.dataSource = new MatTableDataSource<any>(this.transferData);
            this.selection = this.transferData;
        })
    }

    retrieveLogHistory(): void {
        this.planningService.listLogs(this.id).subscribe(response => {
            this.planning = response
            this.isLoading$.next(false);
        })
    }
    onUserSelect(id: any): void {
        this.userId = id;
    }

    onAssign(): void {
        this.isLoading$.next(true)
        this.planningService.assignTransferData({
            "planningId": this.id,
            "userId": this.userId
        }).subscribe({
            next: () => {
                this.isLoading$.next(false)
                this.step$.next(1);
                handleSuccess(this.snackBar, { message: "Assigned successfully" }, this.isLoading$);
            },
            error : (body) =>{
                this.isLoading$.next(false)
                this.step$.next(1)
                handleError(this.snackBar, body, this.isLoading$);
            }
        })
    }

}

