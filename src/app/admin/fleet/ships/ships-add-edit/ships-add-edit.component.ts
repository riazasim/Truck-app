import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: "app-ships-add-edit",
    templateUrl: './ships-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    shipForm: FormGroup;
    id: number;
    appliedFilters: any = {};

    selfPropelled = [
        { id: 1, name: 'Self Propelled 1' },
        { id: 2, name: 'Self Propelled 2' },
        { id: 3, name: 'Self Propelled 3' },
    ]
    typeOfLock = [
        { id: 1, name: 'Type Of Lock1' },
        { id: 2, name: 'Type Of Lock2' },
        { id: 3, name: 'Type Of Lock3' },
    ]

    constructor(private readonly fb: UntypedFormBuilder,
        private readonly shipService: ShipsService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private snackBar : MatSnackBar) {
        this.subscribeForQueryParams();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            combineLatest([
                this.shipService.get(this.id)
            ]).subscribe(([ship]: [ShipModel]) => {
                this.initForm(ship);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    applyFilter(target: any, column: string): void {
        if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
            this.appliedFilters[column] = target.value;
        } else {
            delete this.appliedFilters[column];
        }
    }

    initForm(data: ShipModel = <ShipModel>{}): void {
        this.shipForm = this.fb.group({
            name: this.fb.control(data?.name || '', [Validators.required]),
            registrationNo: this.fb.control(data?.registrationNo || '', [Validators.required]),
            ais: this.fb.control(data?.ais || '', [Validators.required]),
            selfPropelled: this.fb.control(data?.selfPropelled || '', [Validators.required]),
            lockType: this.fb.control(data?.lockType || '', [Validators.required]),
            length: this.fb.control(data?.length || '', [Validators.required]),
            width: this.fb.control(data?.width || '', [Validators.required]),
            maxDraft: this.fb.control(data?.maxDraft || '', [Validators.required]),
            aerialGauge: this.fb.control(data?.aerialGauge || '', [Validators.required]),
            maxCapacity: this.fb.control(data?.maxCapacity || '', [Validators.required]),
        });
    }

    saveShip(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.shipService.edit(this.id, this.parseData(this.shipForm.value)).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        } else {
            this.shipService.create(this.parseData(this.shipForm.value)).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        }
    }

    private parseData(data: ShipModel): ShipModel {
        if (!data.shipId) delete data.shipId;
        return data;
    }
}
