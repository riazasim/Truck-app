import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { handleError } from "../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createMaxLengthValidator, createMinLengthValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from 'src/app/core/services/partner.service';

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
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' }
    ]
    status = [
        { id: 1, name: 'Active', value: true },
        { id: 2, name: 'Inactive', value: false }
    ]
    constructor(private partnerService: PartnerService,
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
            this.partnerService.get(this.id).subscribe(response => {
                // console.log(response)
                this.initForm(response);
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: PartnerModel = <PartnerModel>{}): void {
        this.partnerForm = this.fb.group({
                name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
                type: this.fb.control(data?.type || '', [...createRequiredValidators()]),
                status: this.fb.control(data?.status || '' , [...createRequiredValidators()]),
                address: this.fb.control(data?.address || '', [...createRequiredValidators()]),
                phone: this.fb.control(data?.phone || '', [...createRequiredValidators()]),
                email: this.fb.control(data?.email || '', [...createRequiredValidators()]),
            })
    }


    saveUser(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.partnerService.edit(this.id, this.partnerForm.getRawValue()).subscribe({
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
            this.partnerService.create(this.partnerForm.getRawValue()).subscribe({
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
