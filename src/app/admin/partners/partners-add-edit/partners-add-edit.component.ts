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
    selector: 'app-partners-add-edit',
    templateUrl: './partners-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    partnerForm: UntypedFormGroup;
    id: number;
    partnerType = [
        { id: 1, name: 'Public' },
        { id: 2, name: 'Private' }
    ]
    status = [
        { id: 1, name: 'Active', value: true },
        { id: 2, name: 'Inactive', value: false }
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
                // console.log(response)
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: any = <any>{}): void {
        this.partnerForm = this.fb.group({
                partnerName: this.fb.control(data?.partnerName || '', [...createRequiredValidators()]),
                partnerType: this.fb.control(data?.partnerType || '', [...createRequiredValidators()]),
                status: this.fb.control(data?.status || '' , [...createRequiredValidators()]),
                address: this.fb.control(data?.address || '', [...createRequiredValidators()]),
                phone: this.fb.control(data?.phone || '', [...createRequiredValidators() , Validators.pattern("[- +()0-9]+") , ...createMinLengthValidator(7) , ...createMaxLengthValidator(17)]),
                email: this.fb.control(data?.email || '', [...createRequiredValidators()]),
            })
    }


    saveUser(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.userService.edit(this.id, this.partnerForm.getRawValue()).subscribe({
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
            this.partnerForm.patchValue({ user: { roles: [this.partnerForm.getRawValue().user.roles] } });
            this.userService.create(this.partnerForm.getRawValue()).subscribe({
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
