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
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
    selector: 'scheduling-view-modal',
    templateUrl: './scheduling-view-modal.component.html',
    styleUrls: ['./scheduling-view-modal.component.scss'],
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
export class SchedulingViewModalComponent implements OnChanges {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() id: number;
    @Input() modal: string;
    @Input() sidenav: MatSidenav;
    @Input() planning$: BehaviorSubject<any | null>;
    userIds: any[] = [];
    planning: any;
    shipmentLogs: any[];
    step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    displayedColumns: string[] = ['select', 'name'];
    transferData: any[];
    dataSource: MatTableDataSource<any>
    selection: any;
    userRole : string;
    selectedRole : string;

    constructor(
        private readonly planningService: PlanningService,
        private readonly dialog: MatDialog,
        private readonly snackBar: MatSnackBar,
        private readonly roleService : RolesService
    ) {
        this.getUser()
    }

    ngOnChanges(): void {
        this.retrieveLogHistory();
    }

    getUser(){
        this.userRole = this.roleService.getUserRoles();
    }

    openImageModal(image: string): void {
        this.dialog.open(OpenImageModalComponent, {
            data: image
        });
    }
    onRoleSelect(userRole: string): void {
        this.isLoading$.next(true)
        const data = {
            "planningId" : this.id,
            "userRole" : userRole
        }
        this.planningService.getTransferData(data).subscribe((response: any) => {
            this.isLoading$.next(false)
            this.step$.next(2)
            this.transferData = response.data.attributes;
            this.dataSource = new MatTableDataSource<any>(this.transferData);
            console.log('transfer',this.dataSource)
            this.selection = this.transferData;
        })
    }

    retrieveLogHistory(): void {
        this.planningService.listLogs(this.id).subscribe(response => {
            this.planning = response[0].attributes
            this.isLoading$.next(false);
        })
    }
    onUserSelect(id: any): void {
        if (!this.userIds) {
            this.userIds = [];
        }

        const index = this.userIds.indexOf(id);
        if (index === -1) {
            this.userIds.push(id);
        } else {
            this.userIds.splice(index, 1);
        }
    }

    onAssign(): void {
        this.isLoading$.next(true)
        this.planningService.assignTransferData({
            "planningId": this.id,
            "userIds": this.userIds
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

