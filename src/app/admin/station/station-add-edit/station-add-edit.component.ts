import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { handleError } from "../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { StationService } from 'src/app/core/services/stations.service';
import { StationModel } from 'src/app/core/models/station.model';

@Component({
    selector: 'app-station-add-edit',
    templateUrl: './station-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    stationForm: UntypedFormGroup;
    id: number;
    stationType = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' }
    ]
    constructor(private stationService: StationService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: UntypedFormBuilder,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.subscribeForQueryParams();
        this.initForm();
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.stationService.get(this.id).subscribe(response => {
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: StationModel = <StationModel>{}): void {
        this.stationForm = this.fb.group({
                name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
                type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
        });
    }


    saveStation(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.stationService.edit(this.id, this.stationForm.getRawValue()).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        } else {
            this.stationService.create(this.stationForm.getRawValue()).subscribe({
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
}
