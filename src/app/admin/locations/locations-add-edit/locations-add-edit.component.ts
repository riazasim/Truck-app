import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocationModel } from 'src/app/core/models/location.model';
import { LocationService } from 'src/app/core/services/location.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { createMaxLengthValidator, createMinLengthValidator, createPatternValidators, createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-locations-add-edit',
    templateUrl: './locations-add-edit.component.html'
})
export class LocationsAddEditComponent implements OnInit {
    locationForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    location$: BehaviorSubject<LocationModel | null> = new BehaviorSubject<LocationModel | null>(null);
    id: number;
    phoneRegionCode : string;
    constructor(private fb: UntypedFormBuilder,
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.subscribeForQueryParams();
    }

    // onPhoneInputChange(ev : any){
    //     const temp = String(String(String(ev.target.value).split(" " , 1)).split("(",1));
    //     this.phoneRegionCode = String(temp.slice(0,4))
    //     console.log(this.phoneRegionCode)
    // }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.locationService.get(this.id).subscribe(async response => {
                this.initForm(response);
                this.location$.next({ ...response })
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
    }

    clearImgPreview(): void {
        const location = this.location$.value;
        if (location) {
            location.imgPreview = null as any;
        }
        this.locationForm.get('imgPreview')?.patchValue(null);
    }

    initForm(data: LocationModel = <LocationModel>{}): void {
        this.locationForm = this.fb.group({
            //locationId: this.fb.control(data?.id),
            name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
            addrCoordinates: this.fb.control(data?.addrCoordinates || '', [...createRequiredValidators()]),
            addrStreet: this.fb.control(data?.addrStreet || '', [...createRequiredValidators()]),
            addrNumber: this.fb.control(data?.addrNumber || '', [...createRequiredValidators()]),
            addrCity: this.fb.control(data?.addrCity || '', [...createRequiredValidators()]),
            addrCountry: this.fb.control(data?.addrCountry || '', [...createRequiredValidators()]),
            addrCounty: this.fb.control(data?.addrCounty || '', [...createRequiredValidators()]),
            addrZipCode: this.fb.control(data?.addrZipCode || '', [...createRequiredValidators()]),
            addrTimezone: this.fb.control(data?.addrTimezone || '', [...createRequiredValidators()]),
            contactFirstName: this.fb.control(data?.contactFirstName || '', [...createRequiredValidators()]),
            contactLastName: this.fb.control(data?.contactLastName || '', [...createRequiredValidators()]),
            contactPhone: this.fb.control(data?.contactPhone || '', [...createRequiredValidators() , ...createPatternValidators(RegExp("[-+()0-9 ]")) , ...createMinLengthValidator(7) , ...createMaxLengthValidator(17)]),
            contactPhoneRegionCode: this.fb.control(data?.contactPhoneRegionCode || '', [...createRequiredValidators(), ...createMaxLengthValidator(4) , ...createPatternValidators(RegExp("[-+0-9 ]"))]),
            contactEmail: this.fb.control(data?.contactEmail || '', [...createRequiredValidators(), Validators.email]),
            comments: this.fb.control(data?.comments || '', []),
            imgPreview: this.fb.control(data?.imgPreview, []),
            // customFields: this.fb.control(data?.customFields, []),
        });
    }

    setImgPreview(target: any, input: any): void {
        if (target.files.item(0)) {
            input.value = target.files.item(0).name
            this.locationForm.get('imgPreview')?.patchValue(target.files.item(0));
        }
    }

    saveLocation(): void {
        this.isLoading$.next(true)
        if (this.id) {
            this.locationService.edit(this.id, this.parseData(this.locationForm.value)).subscribe({
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
            this.locationService.create(this.locationForm.value).subscribe({
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

    parseData(location: any): any {
        const data = { ...location };
        if (!data.imgPreview) {
            delete data.imgPreview;
        }
        return location;
    }
}
