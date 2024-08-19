import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { handleError } from "../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createMaxLengthValidator, createMinLengthValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';

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
        { id: 1, name: 'Public' },
        { id: 2, name: 'Private' }
    ]
    constructor(private userService: UserService,
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
            this.userService.get(this.id).subscribe(response => {
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: any = <any>{}): void {
        this.stationForm = this.fb.group({
                stationName: this.fb.control(data?.user?.stationName || '', [...createRequiredValidators()]),
                stationType: this.fb.control(data?.user?.stationType || '', [...createRequiredValidators()]),
        });
    }


    saveUser(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.userService.edit(this.id, this.stationForm.getRawValue()).subscribe({
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
            this.stationForm.patchValue({ user: { roles: [this.stationForm.getRawValue().user.roles] } });
            this.userService.create(this.stationForm.getRawValue()).subscribe({
                next: () => {
                    this.isLoading$.next(false)
                    this.router.navigate(['../../success'], { relativeTo: this.route });
                },
                error: (body: any) => {
                    this.isLoading$.next(false)
                    handleError(this.snackBar, body, this.isLoading$)
                }
            });
        }
    }
}
