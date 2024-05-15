import { ChangeDetectionStrategy, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomFieldModel } from 'src/app/core/models/custom-field.model';
import { OperationModel } from 'src/app/core/models/operation.model';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { ProductModel } from 'src/app/core/models/product.model';
import { SchedulingCustomField } from 'src/app/core/models/scheduling.model';
import { PlanningService } from 'src/app/core/services/planning.service';
import { MatStepper } from '@angular/material/stepper';
import { DockModel } from 'src/app/core/models/dock.model';
import { BuildingModel } from 'src/app/core/models/building.model';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { getFormatHourSlot } from '../scheduling-box.helper';
import { PlanningModel, convoyModel } from 'src/app/core/models/planning.model';
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MicroService } from 'src/app/core/services/micro.service';

@Component({
    selector: 'app-add-scheduling',
    templateUrl: './add-scheduling.component.html',
    styleUrls: ['./add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSchedulingComponent implements OnInit {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    schedulingForm: FormGroup;
    convoyForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

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
    images: any[] = [];
    imageLen: number = 0;
    tempImg: File[] = [];
    customInputsFetched: boolean = false;
    dateVal: string;
    timeVal: string;
    dateTimeVal: string;
    search: string;
    slots: number[] = [];
    ignoreSlots: number[] = [];
    tomorrowSlots: number[] = [];
    today: Date;
    tomorrow: Date;
    selectedSlot$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    selectedCustomer$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    ports: any[] = [];
    getFormatHourSlot: Function;

    id: number;
    shipsList: any;
    filterDate: Date = new Date();
    filterTime = '00:00:00'

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }

    zone = [
        { id: 1, name: 'zone1' },
        { id: 2, name: 'zone2' },
        { id: 3, name: 'zone3' },
    ];
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
    typeOfLock = [
        { id: 1, name: 'type of lock1' },
        { id: 2, name: 'type of lock2' },
        { id: 3, name: 'type of lock3' },
    ];
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

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly shipsService: ShipsService,
        private readonly microService: MicroService,
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
    }

    ngOnInit(): void {
        // this.initializeSlots();
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        this.initConvoyForm();
        this.isLoading$.next(false);
        this.retrivePorts();
    }

    formatDate(date: Date | string): string {
        let formattedDate = '';

        if (typeof date === 'string') {
            const tempDate = new Date(date);
            formattedDate = this.formatDateObject(tempDate);
        } else {
            formattedDate = this.formatDateObject(date);
        }

        return formattedDate;
    }


    navigate(index: number) {
        this.convoys.push(this.convoyForm.value)
        this.imageLen++
        this.tempImg = [];
        this.initConvoyForm()
        this.matStepper.selectedIndex = index;
    }

    retrivePorts() {
        this.microService.getPorts().subscribe({
            next: res => {
                if (res.length > 0) {
                    res?.forEach((item: any) => {
                        this.ports.push(item?.attributes);
                    });
                }
                this.isPortsLoading$.next(false)
            },
            error: err => {
                throw err;
            }
        })
    }


    next(index: any): void {
        // Update the step status accordingly
        if (this.matStepper.selectedIndex === 0) {
            this.retrieveShips();
        }
        // Move to the next step
        this.matStepper.selectedIndex = index;
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.schedulingForm.patchValue({ routingDetail: { estimatedTimeArrival: this.dateVal } })
    }
    OnTimeChange(value: any) {
        this.timeVal = value
    }

    retrieveShips(): void {
        let data = {
            "start": '',
            "length": '',
            "filters": ["", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.shipsService.getShipList(data).subscribe(response => {
            this.shipsList = response;

            this.isLoading$.next(false);
        })
    }

    onPortChange(ev: any) {
        let port: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) port = item;
            // console.log(item.id)
        })
        if (port) {
            this.schedulingForm.patchValue({ routingDetail: { ridCoordinates: port?.addrCoordinates } })
        }
        console.log(port)
    }

    onShipSelected(ev: any): void {
        const selectedShipId = ev.target.value
        const selectedShip = this.shipsList.find((ship:any) => Number(ship.attributes.id) === Number(selectedShipId));
        if (selectedShip) {
            this.convoyForm.patchValue({
                width: selectedShip.attributes.width || '',
                maxDraft: selectedShip.attributes.maxDraft || '',
                maxQuantity: selectedShip.attributes.maxCapacity || ''
            });
        }
    }


    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initConvoyForm(data?: convoyModel): void {
        this.convoyForm = this.fb.group({
            navigationType: this.fb.control(data?.navigationType, [...createRequiredValidators()]),
            company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
            // ship: this.fb.control(data?.ship || ''),
            ship: this.fb.control(data?.ship || '', [...createRequiredValidators()]),
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
            quantity: this.fb.control(data?.quantity || null, [...createRequiredValidators()]),
            unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
            originPort: this.fb.control(data?.originPort || '', [...createRequiredValidators()]),
            destination: this.fb.control(data?.destination || '', [...createRequiredValidators()]),
            observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
            additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
            clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
            operatorComments: this.fb.control(data?.operatorComments, [...createRequiredValidators()]),
        })
    }

    initForm(data?: PlanningModel): void {
        this.schedulingForm = this.fb.group({
            routingDetail: this.fb.group({
                convoyType: this.fb.control(data?.routingDetail?.convoyType, [...createRequiredValidators()]),
                // convoyType: this.fb.control(data?.routingDetail?.convoyType || ''),
                estimatedTimeArrival: this.fb.control(data?.routingDetail?.estimatedTimeArrival || ''),
                locationPort: this.fb.control(data?.routingDetail?.locationPort || '', [...createRequiredValidators()]),
                zone: this.fb.control(data?.routingDetail?.zone || '', [...createRequiredValidators()]),
                departurePort: this.fb.control(data?.routingDetail?.departurePort || '', [...createRequiredValidators()]),
                arrivalPort: this.fb.control(data?.routingDetail?.arrivalPort || '', [...createRequiredValidators()]),
                pilotCompany: this.fb.control(data?.routingDetail?.pilotCompany || '', [...createRequiredValidators()]),
                length: this.fb.control(data?.routingDetail?.length || null, [...createRequiredValidators()]),
                width: this.fb.control(data?.routingDetail?.width || null, [...createRequiredValidators()]),
                maxDraft: this.fb.control(data?.routingDetail?.maxDraft || null, [...createRequiredValidators()]),
                arrivalGuage: this.fb.control(data?.routingDetail?.arrivalGuage || null, [...createRequiredValidators()]),
                maxCapacity: this.fb.control(data?.routingDetail?.maxCapacity || null, [...createRequiredValidators()]),
                lockType: this.fb.control(data?.routingDetail?.lockType || '', [...createRequiredValidators()]),
                ridCoordinates: this.fb.control(data?.routingDetail?.ridCoordinates || '', [...createRequiredValidators()]),
            }),
            convoyDetail: this.fb.control(data?.convoyDetail || [], [...createRequiredValidators()]),
            documents: this.fb.control(data?.documents || [], [...createRequiredValidators()]),
        });
    }

    saveScheduling(): void {
        this.isLoading$.next(true);
        this.convoys.push(this.convoyForm.value)
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`
        this.schedulingForm.patchValue({ convoyDetail: this.convoys, documents: this.images, routingDetail: { estimatedTimeArrival: this.dateTimeVal } })
        this.planningService.create(this.schedulingForm.value).subscribe({
            next: () => {
                this.router.navigate(['../success'], { relativeTo: this.route });
            },
            error: (body) => {
                handleError(this.snackBar, body);
                this.matStepper.selectedIndex = 0;
                this.isLoading$.next(false);
            }
        })
    }

    patchFile(file: File, index: number): void {
        this.tempImg[index] = file
        console.log(this.tempImg)
        this.images[this.imageLen] = this.tempImg;
    }

}
