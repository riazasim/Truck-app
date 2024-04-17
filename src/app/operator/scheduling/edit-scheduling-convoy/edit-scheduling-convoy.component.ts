import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from "rxjs";
import { PlanningService } from 'src/app/core/services/planning.service';
import { convoyModel } from 'src/app/core/models/planning.model';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-edit-scheduling-convoy',
    templateUrl: './edit-scheduling-convoy.component.html',
    styleUrl: './edit-scheduling-convoy.component.scss',
})
export class EditSchedulingConvoyComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['id', 'manevure', 'ship', 'operator', 'destination', 'navigationType', 'sidStatus', 'actions'];
    dataSource: convoyModel[] = [];
    originalSource: convoyModel[] = [];
    appliedFilters: any = {};
    id : number;
    headerTitle : string;

    constructor(private readonly dialogService: MatDialog,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly cd: ChangeDetectorRef) {
        this.retrievePlanningList();
    }


    retrievePlanningList(): void {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe(response => {
            this.headerTitle = String(response?.rId)
            this.dataSource = response.planningConvoys;
            this.originalSource = response.planningConvoys;
            this.isLoading$.next(false);
        });
    }

    openDeleteModal(id: number) {
        this.dialogService.open(SchedulingDeleteModalComponent, {
            disableClose: true,
            data: { "id" : id , "title" : "convoy"}
        }).afterClosed()
            .subscribe({
                next: (isDelete: boolean) => {
                    if (isDelete) {
                        this.isLoading$.next(true);
                        this.planningService.deleteConvoy(id).subscribe(() => {
                            this.retrievePlanningList();
                            this.cd.detectChanges();
                        })
                    }
                }
            });
    }
}
