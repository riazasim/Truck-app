import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { LocationModel } from 'src/app/core/models/location.model';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { UserModel } from 'src/app/core/models/user.model';
import { LocationService } from 'src/app/core/services/location.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserService } from 'src/app/core/services/user.service';
import { SignupModel } from "../../../core/models/signup.model";
import { handleSuccess } from "../../../shared/utils/success-handling.function";
import { handleError } from "../../../shared/utils/error-handling.function";
import { MatSnackBar } from "@angular/material/snack-bar";
import { createMaxLengthValidator, createMinLengthValidator, createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-users-add-edit',
    templateUrl: './users-add-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideOut', [
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
            ])
        ])
    ]
})
export class UsersAddEditComponent {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    selectedRole$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    userForm: UntypedFormGroup;
    displayedColumns = ['name', 'city', 'county', 'country', 'status', 'assigned'];
    id: number;
    status = [
        { name: 'Active', value: true },
        { name: 'Inactive', value: false }
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
    onRoleChange(value: any) {
        this.selectedRole$.next(value.target.value);
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.userService.get(this.id).subscribe(response => {
                console.log(response)
                this.initForm(response);
                this.selectedRole$.next('DRIVER');
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    initForm(data: UserModel = <UserModel>{}): void {

        this.userForm = this.fb.group({
            user: this.fb.group({
                email: this.fb.control(data?.user?.email || '', { nonNullable: false }),
                userRole: this.fb.control(data?.user?.userRole || '', { nonNullable: false }),
                status: this.fb.control(data?.user?.status || true),
            }),
            userSetting: this.fb.group({
                timezone: this.fb.control(data?.userSetting?.timezone || '', { nonNullable: false }),
                firstName: this.fb.control(data?.userSetting?.firstName || '', { nonNullable: false }),
                lastName: this.fb.control(data?.userSetting?.lastName || '', { nonNullable: false }),
                language: this.fb.control(data?.userSetting?.language || '', { nonNullable: false }),
                phone: this.fb.control(data?.userSetting?.phone || '', [...createRequiredValidators() , Validators.pattern("[- +()0-9]+") , ...createMinLengthValidator(7) , ...createMaxLengthValidator(15)]),
                phoneRegionCode: this.fb.control(data?.userSetting?.phoneRegionCode || '', [...createRequiredValidators(), ...createMaxLengthValidator(4) , Validators.pattern("[- +()0-9]+")]),
                identityDocumentType: this.fb.control(data?.userSetting?.identityDocumentType || '', { nonNullable: false }),
                idNumber: this.fb.control(data?.userSetting?.idNumber || '', { nonNullable: false })
            })
        });
    }


    saveUser(): void {
        this.isLoading$.next(true);
        if (this.id) {
            this.userService.edit(this.id, this.userForm.getRawValue()).subscribe({
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
            this.userForm.patchValue({ user: { roles: [this.userForm.getRawValue().user.roles] } });
            this.userService.create(this.userForm.getRawValue()).subscribe({
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
