import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    oldId: any[] = [];
    oldImagesId: any[] = [];
    images: any[] = [];
    tempImg: File[] = [];

    stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    id: number;

    ship = [
        { id: 1, name: 'ship1' },
        { id: 2, name: 'ship2' },
        { id: 3, name: 'ship3' },
    ];
    shipType = [
        { id: 1, name: 'ship type1' },
        { id: 2, name: 'ship type2' },
        { id: 3, name: 'ship type3' },
    ];
    agent = [
        { id: 1, name: 'agent1' },
        { id: 2, name: 'agent2' },
        { id: 3, name: 'agent3' },
    ];
    operator = [
        { id: 1, name: 'operator1' },
        { id: 2, name: 'operator2' },
        { id: 3, name: 'operator3' },
    ];
    trafficType = [
        { id: 1, name: 'traffic type1' },
        { id: 2, name: 'traffic type2' },
        { id: 3, name: 'traffic type3' },
    ];
    operationType = [
        { id: 1, name: 'operation type1' },
        { id: 2, name: 'operation type2' },
        { id: 3, name: 'operation type3' },
    ];
    cargo = [
        { id: 1, name: 'cargo1' },
        { id: 2, name: 'cargo2' },
        { id: 3, name: 'cargo3' },
    ];
    portOfOrigin = [
        { id: 1, name: 'port of origin1' },
        { id: 2, name: 'port of origin2' },
        { id: 3, name: 'port of origin3' },
    ];
    destination = [
        { id: 1, name: 'destination1' },
        { id: 2, name: 'destination2' },
        { id: 3, name: 'destination3' },
    ];

    constructor(private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,) { }

    ngOnInit(): void {
        this.getRoute()
        this.initConvoyForm();
        this.isLoading$.next(false)
    }

    getRoute() {
        this.id = this.route.snapshot.params['id'];
        this.planningService.getConvoy(this.id).subscribe(response => {
            response.planningConvoyDocuments.map((item: any) => {
                this.oldImagesId.push(item.id)
            })
            this.initConvoyForm(response);
            this.isLoading$.next(false);
        });
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
            navigationType: this.fb.control(data?.navigationType || '',[Validators.required]),
            ship: this.fb.control(data?.ship || '',[Validators.required]),
            shipType: this.fb.control(data?.shipType || '',[Validators.required]),
            pavilion: this.fb.control(data?.pavilion || '',[Validators.required]),
            enginePower: this.fb.control(data?.enginePower || null,[Validators.required]),
            lengthOverall: this.fb.control(data?.lengthOverall || null,[Validators.required]),
            width: this.fb.control(data?.width || null,[Validators.required]),
            maxDraft: this.fb.control(data?.maxDraft || null,[Validators.required]),
            maxQuantity: this.fb.control(data?.maxQuantity || null,[Validators.required]),
            agent: this.fb.control(data?.agent || '',[Validators.required]),
            maneuvering: this.fb.control(data?.maneuvering || '',[Validators.required]),
            shipowner: this.fb.control(data?.shipowner || '',[Validators.required]),
            purpose: this.fb.control(data?.purpose || '',[Validators.required]),
            operator: this.fb.control(data?.operator || '',[Validators.required]),
            trafficType: this.fb.control(data?.trafficType || '',[Validators.required]),
            operatonType: this.fb.control(data?.operatonType || '',[Validators.required]),
            cargo: this.fb.control(data?.cargo || '',[Validators.required]),
            quantity: this.fb.control(data?.quantity || '',[Validators.required]),
            unitNo: this.fb.control(data?.unitNo || '',[Validators.required]),
            originPort: this.fb.control(data?.originPort || '',[Validators.required]),
            destination: this.fb.control(data?.destination || '',[Validators.required]),
            observation: this.fb.control(data?.observation || '',[Validators.required]),
            additionalOperator: this.fb.control(data?.additionalOperator || '',[Validators.required]),
            clientComments: this.fb.control(data?.clientComments || '',[Validators.required]),
            operatorComments: this.fb.control(data?.operatorComments || '',[Validators.required]),
            oldDocuments: this.fb.control(data?.oldDocuments || '',[Validators.required]),
            documents: this.fb.control(data?.documents || [],[Validators.required]),
        })
    }

    updateConvoys(): void {
        this.isLoading$.next(true);
        this.convoyForm.patchValue({ documents: this.images, oldDocuments: `[${String(this.oldId)}]` })
        console.log(this.convoyForm)
        this.planningService.editConvoys(this.id, this.convoyForm.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['../../../../success'], { relativeTo: this.route });
                },
                error: (body) => {
                    handleError(this.snackBar, body);
                    this.matStepper.selectedIndex = 0;
                    this.isLoading$.next(false);
                }
            })
    }

    patchFile(file: File, index: number): void {
        this.images[index] = file
        this.oldId[index] = this.oldImagesId[index]
    }

}
