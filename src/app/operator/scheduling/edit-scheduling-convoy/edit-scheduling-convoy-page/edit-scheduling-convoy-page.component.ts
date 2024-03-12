import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, take, delay } from 'rxjs';
import { CustomFieldData, CustomFieldList, ResponseCustomFieldList } from 'src/app/core/models/custom-field.model';
import { CustomFieldModel, ResponseCustomField } from 'src/app/core/models/custom-field.model';
import { OperationModel } from 'src/app/core/models/operation.model';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { SchedulingCustomField } from 'src/app/core/models/scheduling.model';
import { SchedulingModel } from 'src/app/core/models/scheduling.model';
import { CustomFieldService } from 'src/app/core/services/custom-field.service';
import { OperationService } from 'src/app/core/services/operation.service';
import { PartnerService } from 'src/app/core/services/partner.service';
import { PlanningService } from 'src/app/core/services/planning.service';
import { SchedulingAddProductModalComponent } from '../../scheduling-add-product-modal/scheduling-add-product-modal.component';
import { ProductService } from 'src/app/core/services/product.service';
import { MatStepper } from '@angular/material/stepper';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { DockModel } from 'src/app/core/models/dock.model';
import { DockService } from 'src/app/core/services/dock.service';
import { BuildingModel } from 'src/app/core/models/building.model';
import { BuildingService } from 'src/app/core/services/building.service';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { WorkingHoursModel } from 'src/app/core/models/working-hours.model';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { getFormatHourSlot } from '../../scheduling-box.helper';
import * as moment from 'moment';
import { extractPhoneNumber } from 'src/app/shared/validators/phone-numbers';
import { PlanningModel, convoyModel } from 'src/app/core/models/planning.model';
import { convertJsonToFormData } from 'src/app/shared/utils/api.functions';


@Component({
    selector: 'app-edit-scheduling-convoy-page',
    templateUrl: './edit-scheduling-convoy-page.component.html',
    styleUrl: './edit-scheduling-convoy-page.component.scss'
})
export class EditSchedulingConvoyPageComponent {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    convoyForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    isLinear = true;
    customers: PartnerModel[] = [];
    operations: OperationModel[] = [];

    transportData: CustomFieldModel[] | undefined;
    cargoData: CustomFieldModel[] | undefined;
    additionalData: CustomFieldModel[] | undefined;

    customFieldTransportData: SchedulingCustomField[] = [];
    customFieldCargoData: SchedulingCustomField[] = [];
    customFieldAdditionalData: SchedulingCustomField[] = [];

    products: ProductModel[] = [];
    listProducts: ProductModel[] = [];
    docks: DockModel[] = [];
    buildings: BuildingModel[] = [];

    convoys: convoyModel[] = [];
    images: File[] = [];

    customInputsFetched: boolean = false;

    search: string;

    stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stepTwo$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stepThree$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    stepFour$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    // stepFive$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    slots: number[] = [];
    ignoreSlots: number[] = [];
    tomorrowSlots: number[] = [];
    today: Date;
    tomorrow: Date;
    selectedSlot$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    selectedCustomer$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    getFormatHourSlot: Function;

    id: number;

    customer = [
        { id: 1, name: 'customer1' },
        { id: 2, name: 'customer2' },
        { id: 3, name: 'customer3' },
    ]

    constructor(private readonly fb: FormBuilder,
        private readonly partnerService: PartnerService,
        private readonly operationService: OperationService,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly customFieldService: CustomFieldService,
        private readonly dialogService: MatDialog,
        private readonly productService: ProductService,
        private readonly dockService: DockService,
        private readonly buildingService: BuildingService,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly organizationService: OrganizationService) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
    }

    ngOnInit(): void {
        this.getRoute()
        this.initConvoyForm();
        this.isLoading$.next(false)
    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.getConvoy(this.id).subscribe(response => {
            console.log(response)
            this.initConvoyForm(response);
            this.isLoading$.next(false);
        });
    }

    navigate(index: number) {
        this.convoys.push(this.convoyForm.value)
        this.initConvoyForm()
        this.matStepper.selectedIndex = index;
    }


    next(step$: BehaviorSubject<boolean>, formGroup: FormGroup, index: any): void {
        if (formGroup.valid) {
            // Update the step status accordingly
            if (this.matStepper.selectedIndex === 0) {
                this.stepOne$.next(true);
            }
            // Move to the next step
            this.matStepper.selectedIndex = index;
        } else {
            // If the form is not valid, mark all fields as touched to display validation messages
            Object.values(formGroup.controls).forEach(control => {
                control.markAsTouched();
            });
        }
    }


    initConvoyForm(data?: convoyModel): void {
        this.convoyForm = this.fb.group({
            navigationType: this.fb.control(data?.navigationType || ''),
            ship: this.fb.control(data?.ship || ''),
            shipType: this.fb.control(data?.shipType || ''),
            pavilion: this.fb.control(data?.pavilion || ''),
            enginePower: this.fb.control(data?.enginePower || ''),
            lengthOverall: this.fb.control(data?.lengthOverall || ''),
            width: this.fb.control(data?.width || ''),
            maxDraft: this.fb.control(data?.maxDraft || ''),
            maxQuantity: this.fb.control(data?.maxQuantity || ''),
            agent: this.fb.control(data?.agent || ''),
            maneuvering: this.fb.control(data?.maneuvering || ''),
            shipowner: this.fb.control(data?.shipowner || ''),
            purpose: this.fb.control(data?.purpose || ''),
            operator: this.fb.control(data?.operator || ''),
            trafficType: this.fb.control(data?.trafficType || ''),
            operatonType: this.fb.control(data?.operatonType || ''),
            cargo: this.fb.control(data?.cargo || ''),
            quantity: this.fb.control(data?.quantity || ''),
            unitNo: this.fb.control(data?.unitNo || ''),
            originPort: this.fb.control(data?.originPort || ''),
            destination: this.fb.control(data?.destination || ''),
            observation: this.fb.control(data?.observation || ''),
            additionalOperator: this.fb.control(data?.additionalOperator || ''),
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments || ''),
            documents: this.fb.control(data?.planningConvoyDocuments || []),
        })
    }

    updateConvoys(): void {
        this.isLoading$.next(true);
        this.convoys.push(this.convoyForm.value)
        this.convoyForm.patchValue({planningConvoyDocuments: this.images })
        console.log(this.convoyForm)
        // this.planningService.create(this.convoyForm.value).subscribe({
        //     next: () => {
        //         this.router.navigate(['../success'], { relativeTo: this.route });
        //     },
        //     error: (body) => {
        //         handleError(this.snackBar, body);
        //         this.matStepper.selectedIndex = 0;
        //         this.isLoading$.next(false);
        //     }
        // })
    }

    patchFile(file: File, index: number): void {
        this.images[index] = file
        console.log(this.images)
    }

}
