import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { getFormatHourSlot } from '../scheduling-box.helper';
import { PlanningDetailModel } from 'src/app/core/models/planning.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';


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
            convoyType: this.fb.control(data?.convoyType || '',[...createRequiredValidators()]),
            estimatedTimeArrival: this.fb.control(data?.estimatedTimeArrival || '',[...createRequiredValidators()]),
            locationPort: this.fb.control(data?.locationPort || '',[...createRequiredValidators()]),
            zone: this.fb.control(data?.zone || null,[...createRequiredValidators()]),
            departurePort: this.fb.control(data?.departurePort || '',[...createRequiredValidators()]),
            arrivalPort: this.fb.control(data?.arrivalPort || '',[...createRequiredValidators()]),
            pilotCompany: this.fb.control(data?.pilotCompany || '',[...createRequiredValidators()]),
            length: this.fb.control(data?.length || null,[...createRequiredValidators()]),
            width: this.fb.control(data?.width || null,[...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || null,[...createRequiredValidators()]),
            arrivalGauge: this.fb.control(data?.arrivalGauge || null,[...createRequiredValidators()]),
            maxCapacity: this.fb.control(data?.maxCapacity || null,[...createRequiredValidators()]),
            lockType: this.fb.control(data?.lockType || '',[...createRequiredValidators()]),
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
