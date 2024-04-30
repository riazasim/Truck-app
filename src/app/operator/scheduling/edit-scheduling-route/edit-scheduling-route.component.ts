import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { PlanningDetailModel } from 'src/app/core/models/planning.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MicroService } from 'src/app/core/services/micro.service';


@Component({
    selector: 'app-edit-scheduling-route',
    templateUrl: './edit-scheduling-route.component.html',
})
export class EditSchedulingRouteComponent implements OnInit {

    planningForm: FormGroup;
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isRoutesLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    id: number;
    ports: any[] = [];
    dateModal: Date;
    dateVal: string;
    timeVal: string;
    dateTimeVal: string;

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    customer = [
        { id: 1, name: 'customer1' },
        { id: 2, name: 'customer2' },
        { id: 3, name: 'customer3' },
    ]

    zone = [
        { id: 1, name: 'zone1' },
        { id: 2, name: 'zone2' },
        { id: 3, name: 'zone3' },
    ];

    typeOfLock = [
        { id: 1, name: 'type of lock1' },
        { id: 2, name: 'type of lock2' },
        { id: 3, name: 'type of lock3' },
    ];

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly microService: MicroService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.getRoute();
        this.retrivePorts();
    }

    formatDate(date: Date | string): string {
        let formattedDate = '';

        if (typeof date === 'string') {
            const tempDate = new Date(date);
            formattedDate = this.formatDateObject(tempDate);
        } else {
            formattedDate = this.formatDateObject(date);
        }

        return formattedDate;
    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe({
            next: res => {
                const dateTimeVal = res.estimatedTimeArrival.split(" ");
                this.dateModal = new Date(dateTimeVal[0]);
                this.dateVal = dateTimeVal[0];
                this.timeVal = dateTimeVal[1];
                this.initForm(res);
                this.isRoutesLoading$.next(false);
            },
            error: err => {
                this.isRoutesLoading$.next(false);
                throw err;
            }
        });
    }

    retrivePorts() {
        this.microService.getPorts().subscribe({
            next: res => {
                if(res.length > 0){
                    res?.forEach((item: any) => {
                        this.ports.push(item?.attributes);
                    });
                }
                this.isPortsLoading$.next(false)
            },
            error: err => {
                throw err;
            }
        })
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.planningForm.patchValue({ estimatedTimeArrival: this.dateVal })
    }
    OnTimeChange(value: any) {
        this.timeVal = value
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initForm(data?: PlanningDetailModel): void {
        this.planningForm = this.fb.group({
            convoyType: this.fb.control(data?.convoyType || '', [...createRequiredValidators()]),
            estimatedTimeArrival: this.fb.control(data?.estimatedTimeArrival || '', [...createRequiredValidators()]),
            locationPort: this.fb.control(data?.locationPort || '', [...createRequiredValidators()]),
            zone: this.fb.control(data?.zone || null, [...createRequiredValidators()]),
            departurePort: this.fb.control(data?.departurePort || '', [...createRequiredValidators()]),
            arrivalPort: this.fb.control(data?.arrivalPort || '', [...createRequiredValidators()]),
            pilotCompany: this.fb.control(data?.pilotCompany || '', [...createRequiredValidators()]),
            length: this.fb.control(data?.length || null, [...createRequiredValidators()]),
            width: this.fb.control(data?.width || null, [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || null, [...createRequiredValidators()]),
            arrivalGauge: this.fb.control(data?.arrivalGauge || null, [...createRequiredValidators()]),
            maxCapacity: this.fb.control(data?.maxCapacity || null, [...createRequiredValidators()]),
            lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
        })
    }

    updateRoutingDetails(): void {
        this.isLoading$.next(true);
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`
        this.planningForm.patchValue({ estimatedTimeArrival: this.dateTimeVal })
        this.planningService.editRouteingDetails(this.id, this.planningForm.value).subscribe({
            next: () => {
                this.router.navigate(['../../success'], { relativeTo: this.route });
            },
            error: (body) => {
                handleError(this.snackBar, body);
                this.isLoading$.next(false);
            }
        })
    }


}
