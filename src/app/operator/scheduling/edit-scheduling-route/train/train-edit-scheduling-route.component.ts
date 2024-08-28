import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MicroService } from 'src/app/core/services/micro.service';
import { StationService } from 'src/app/core/services/stations.service';
import { TrainsService } from 'src/app/core/services/trains.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-train-edit-scheduling-route',
    templateUrl: './train-edit-scheduling-route.component.html',
    styleUrls: ['./train-edit-scheduling-route.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainEditSchedulingRouteComponent implements OnInit {

    planningForm: FormGroup;
    isRoutesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isStationLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    locomotives: any[] = [];
    locomotiveType: any;
    stationTypes = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' },
    ];
    stations: any[] = [];
    id: number;
    index: number = 0;

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly stationService: StationService,
        private readonly trainsService: TrainsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        private readonly microService: MicroService
    ) { }

    ngOnInit(): void {
        this.getRoute();
        this.initForm();
    }

    moveItemInFormArray(
        formArray: FormArray,
        fromIndex: number,
        toIndex: number
    ): void {
        const dir = toIndex > fromIndex ? 1 : -1;

        const item = formArray.at(fromIndex);
        for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
            const current = formArray.at(i + dir);
            formArray.setControl(i, current);
        }
        formArray.setControl(toIndex, item);
    }


    drop(event: CdkDragDrop<string[]>) {
        this.moveItemInFormArray(this.points, event.previousIndex, event.currentIndex);
    }

    initForm(data?: any): void {
        this.planningForm = this.fb.group({
            locomotiveId: this.fb.control(data?.locomotive?.id || ''),
            conductorType: this.fb.control(data?.conductorType || ''),
            userEmail: this.fb.control(data?.userEmail || ''),
            planningRouteDetails: this.fb.array([]),
        });

        if (data?.planningRouteDetails) {
            data.planningRouteDetails.forEach((point: any) => {
                this.addPoints(point);
            });
        }
    }

    get points(): FormArray {
        return this.planningForm.get('planningRouteDetails') as FormArray;
    }

    addPoints(data?: any): void {
        console.log(data)
        const newPoint = this.fb.group({
            planningRouteDetailId : [data?.id || null],
            pointType: [data?.pointType || ''],
            stationType: [data?.stationType || ''],
            station: [data?.station?.id || '']
        });
        this.points.push(newPoint);
    }

    getRoute(): void {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe({
            next: (res) => {
                this.initForm(res);
                this.retrieveLocomotives();
                this.locomotiveType = res?.locomotive?.type;
                for (let i = 0; i < res?.planningRouteDetails?.length; i++) {
                    console.log(res?.planningRouteDetails[i]?.stationType)
                    this.retrieveStations(res?.planningRouteDetails[i]?.stationType, i);
                }
                this.isRoutesLoading$.next(false);
            },
            error: (err) => {
                this.isRoutesLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    retrieveLocomotives(): void {
        const data = {
            start: '',
            length: '',
            filters: ['', '', '', '', ''],
            order: [{ dir: 'DESC', column: 0 }]
        };
        this.trainsService.pagination(data).subscribe({
            next: (response) => {
                this.locomotives = response?.items || [];
                this.isLoading$.next(false);
            },
            error: (err) => {
                this.isLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    onLocomotiveSelected(event: any): void {
        const selectedLocomotiveId = event.target.value;
        const selectedLocomotive = this.locomotives.find(
            (locomotive) => Number(locomotive.id) === Number(selectedLocomotiveId)
        );

        if (selectedLocomotive) {
            this.locomotiveType = selectedLocomotive?.type;
        }
    }

    onStationTypeChange(event: any, index: any): void {
        this.retrieveStations(event.target.value, index);
    }

    retrieveStations(type: string, index?: any): void {
        this.isStationLoading$.next(true);
        this.stationService.getStationListByType(type).subscribe({
            next: (res) => {
                let stationArray: any[] = [];
                res?.forEach((item: any) => {
                    stationArray.push(item.attributes)
                });
                this.stations[index] = stationArray;
                this.isStationLoading$.next(false);
            },
            error: (err) => {
                this.isStationLoading$.next(false);
                handleError(this.snackBar, err);
            }
        });
    }

    updateRoutingDetails(): void {
        this.isLoading$.next(true);

        this.points.controls.forEach((control, i, arr) => {
            const group = control as FormGroup;
            if (i === 0) {
                group.patchValue({ pointType: 'Start Point' });
            } else if (i === arr.length - 1) {
                group.patchValue({ pointType: 'End Point' });
            } else {
                group.patchValue({ pointType: 'Touch Point' });
            }
        });

        this.planningForm.patchValue({
            planningRouteDetails: this.points.value
        });

        this.planningService.editRouteingDetails(this.id, this.planningForm.value).subscribe({
            next: () => {
                this.router.navigate(['../../success'], { relativeTo: this.route });
            },
            error: (body) => {
                handleError(this.snackBar, body);
                this.isLoading$.next(false);
            }
        });
    }
}
