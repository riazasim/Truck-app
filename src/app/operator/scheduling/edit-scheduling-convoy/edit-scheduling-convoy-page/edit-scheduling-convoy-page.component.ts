import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { convoyModel } from 'src/app/core/models/planning.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { ShipsService } from 'src/app/core/services/ships.service';


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
    shipsList: any;

    stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    id: number;


    companies = [
        { id: 1, name: 'company1' },
        { id: 2, name: 'company2' },
        { id: 3, name: 'company3' },
    ];
    statuses = [
        { id: 1, name: 'Port Queue' },
        { id: 2, name: 'Checked In' },
        { id: 3, name: 'Waiting' },
        { id: 4, name: 'In Berth Operation' },
        { id: 5, name: 'Berth' },
        { id: 6, name: 'In Exit Queue Operation' },
        { id: 7, name: 'Exit Queue' },
        { id: 8, name: 'In New RID Operation' },
        { id: 9, name: 'Checked Out' },
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
        private readonly shipsService: ShipsService,
        private readonly snackBar: MatSnackBar,) { }

    ngOnInit(): void {
        this.getRoute();
        this.retrieveShips();
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

    next(index: any): void {
        this.matStepper.selectedIndex = index;
    }

    retrieveShips(): void {
        let data = {
            "start": '',
            "length": '',
            "filters": ["", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.shipsService.pagination(data).subscribe(response => {
            this.shipsList = response.items;

            this.isLoading$.next(false);
        })
    }


    initConvoyForm(data?: convoyModel): void {
        this.convoyForm = this.fb.group({
            navigationType: this.fb.control(data?.navigationType || '', [...createRequiredValidators()]),
            ship: this.fb.control(data?.ship || '', [...createRequiredValidators()]),
            company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
            shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
            pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
            enginePower: this.fb.control(data?.enginePower || null, [...createRequiredValidators()]),
            lengthOverall: this.fb.control(data?.lengthOverall || null, [...createRequiredValidators()]),
            width: this.fb.control(data?.width || null, [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || null, [...createRequiredValidators()]),
            maxQuantity: this.fb.control(data?.maxQuantity || null, [...createRequiredValidators()]),
            agent: this.fb.control(data?.agent || '', [...createRequiredValidators()]),
            maneuvering: this.fb.control(data?.maneuvering || '', [...createRequiredValidators()]),
            shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
            purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
            operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
            trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
            operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
            cargo: this.fb.control(data?.cargo || '', [...createRequiredValidators()]),
            quantity: this.fb.control(data?.quantity || '', [...createRequiredValidators()]),
            unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
            originPort: this.fb.control(data?.originPort || '', [...createRequiredValidators()]),
            destination: this.fb.control(data?.destination || '', [...createRequiredValidators()]),
            observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
            additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
            clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
            operatorComments: this.fb.control(data?.operatorComments || '', [...createRequiredValidators()]),
            oldDocuments: this.fb.control(data?.oldDocuments || '', [...createRequiredValidators()]),
            documents: this.fb.control(data?.documents || [], [...createRequiredValidators()]),
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
