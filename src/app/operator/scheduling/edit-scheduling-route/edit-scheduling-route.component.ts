import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { getFormatHourSlot } from '../scheduling-box.helper';
import { PlanningDetailModel } from 'src/app/core/models/planning.model';


@Component({
    selector: 'app-edit-scheduling-route',
    templateUrl: './edit-scheduling-route.component.html',
})
export class EditSchedulingRouteComponent implements OnInit {

    planningForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    id: number;
    filterDate: Date = new Date();

    customer = [
        { id: 1, name: 'customer1' },
        { id: 2, name: 'customer2' },
        { id: 3, name: 'customer3' },
    ]
    dateVal: string;
    timeVal: string;
    dateTimeVal: string;

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar) { }

    ngOnInit(): void {
        // this.initializeSlots();
        this.getRoute()
        this.initForm();
    }


    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.get(this.id).subscribe(response => {
            console.log(response)
            this.initForm(response);
            this.isLoading$.next(false);
        });
    }

    OnDateChange(value : any){
        this.dateVal = `${value._i.year}-${value._i.month}-${value._i.date}`
    }
    OnTimeChange(value : any){
        this.timeVal = value
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initForm(data?: PlanningDetailModel): void {
        this.planningForm = this.fb.group({
            convoyType: this.fb.control(data?.convoyType || ''),
            estimatedTimeArrival: this.fb.control(data?.estimatedTimeArrival || ''),
            locationPort: this.fb.control(data?.locationPort || ''),
            zone: this.fb.control(data?.zone || ''),
            departurePort: this.fb.control(data?.departurePort || ''),
            arrivalPort: this.fb.control(data?.arrivalPort || ''),
            pilotCompany: this.fb.control(data?.pilotCompany || ''),
            length: this.fb.control(data?.length || ''),
            width: this.fb.control(data?.width || ''),
            maxDraft: this.fb.control(data?.maxDraft || ''),
            arrivalGauge: this.fb.control(data?.arrivalGauge || ''),
            maxCapacity: this.fb.control(data?.maxCapacity || ''),
            lockType: this.fb.control(data?.lockType || ''),
        })
    }

    updateRoutingDetails(): void {
        this.isLoading$.next(true);
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`
        this.planningForm.patchValue({estimatedTimeArrival : this.dateTimeVal})
        this.planningService.editRouteingDetails(this.id,this.planningForm.value).subscribe({
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
