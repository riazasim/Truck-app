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
import { PageEvent } from '@angular/material/paginator';
import { ProductService } from 'src/app/core/services/product.service';

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
    isPortChangeLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    // listProducts: ProductModel[] = [];
    docks: DockModel[] = [];
    buildings: BuildingModel[] = [];
    productsList: any[] = [];
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
    companies: any[];
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

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly shipsService: ShipsService,
        private readonly productService: ProductService,
        private readonly microService: MicroService,
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        this.initConvoyForm();
        this.isLoading$.next(false);
        this.retrivePorts();
        this.retriveProducts()
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


    retriveProducts() {
        this.isLoading$.next(true);
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.productService.pagination(data).subscribe(response => {
            this.products = response.items;
            this.isLoading$.next(false);
        })
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


    onPortChange(ev: any) {
        this.isPortChangeLoading$.next(true);
        let port: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) port = item;
        })
        if (port) {
            this.schedulingForm.patchValue({ routingDetail: { ridCoordinates: port?.addrCoordinates } })
            this.retriveCompanines(port.id);
        }
        console.log(port)
    }

    retriveCompanines(portId: any) {
        this.microService.getCompanies(portId).subscribe({
            next: res => {
                this.companies = [];
                if (res?.status !== 'error') {
                    res?.forEach((item: any) => {
                        this.companies.push(item?.attributes);
                    });
                }
                if (this.companies.length === 0) {
                    this.schedulingForm.patchValue({ routingDetail: { company: null } })
                }
                this.isPortChangeLoading$.next(false);
            },
            error: err => {
                this.isPortChangeLoading$.next(false);
                throw err
            }
        })
    }



    next(index: any): void {
        if (this.matStepper.selectedIndex === 0) {
            this.retrieveShips();
        }
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

    onShipSelected(ev: any): void {
        const selectedShipId = ev.target.value
        const selectedShip = this.shipsList.find((ship: any) => Number(ship.attributes.id) === Number(selectedShipId));
        if (selectedShip) {
            this.convoyForm.patchValue({
                width: selectedShip.attributes.width || '',
                maxDraft: selectedShip.attributes.maxDraft || '',
                maxQuantity: selectedShip.attributes.maxCapacity || '',
                arrivalGauge: selectedShip.attributes.aerialGauge || '',
                lockType: selectedShip.attributes.lockType || ''
            });
        }
    }

    onProductChange(ev: any) {
        if (this.productsList.includes(ev?.source?.value)) {
            const index = this.productsList.indexOf(ev?.source?.value);
            this.productsList.splice(index, 1);
        }
        else this.productsList.push(ev?.source?.value);
        this.convoyForm.patchValue({ products: `[${this.productsList}]` })
    }


    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initConvoyForm(data?: convoyModel): void {
        this.convoyForm = this.fb.group({
            navigationType: this.fb.control(data?.navigationType, [...createRequiredValidators()]),
            company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
            status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
            ship: this.fb.control(data?.ship || '', [...createRequiredValidators()]),
            shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
            pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
            enginePower: this.fb.control(data?.enginePower || 0, [...createRequiredValidators()]),
            lengthOverall: this.fb.control(data?.lengthOverall || 0, [...createRequiredValidators()]),
            width: this.fb.control(data?.width || 0, [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || 0, [...createRequiredValidators()]),
            maxQuantity: this.fb.control(data?.maxQuantity || 0, [...createRequiredValidators()]),
            agent: this.fb.control(data?.agent || '', [...createRequiredValidators()]),
            maneuvering: this.fb.control(data?.maneuvering || '', [...createRequiredValidators()]),
            shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
            purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
            operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
            trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
            operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
            cargo: this.fb.control(data?.cargo || '', [...createRequiredValidators()]),
            quantity: this.fb.control(data?.quantity || 0, [...createRequiredValidators()]),
            unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
            observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
            additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
            clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
            operatorComments: this.fb.control(data?.operatorComments, [...createRequiredValidators()]),
            products: this.fb.control(data?.products || "", [...createRequiredValidators()]),
            lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
            arrivalGauge: this.fb.control(data?.arrivalGauge || 0, [...createRequiredValidators()]),
        })
    }

    initForm(data?: PlanningModel): void {
        this.schedulingForm = this.fb.group({
            routingDetail: this.fb.group({
                convoyType: this.fb.control(data?.routingDetail?.convoyType, [...createRequiredValidators()]),
                // convoyType: this.fb.control(data?.routingDetail?.convoyType || ''),
                estimatedTimeArrival: this.fb.control(data?.routingDetail?.estimatedTimeArrival || ''),
                // locationPort: this.fb.control(data?.routingDetail?.locationPort || '', [...createRequiredValidators()]),
                departureZone: this.fb.control(data?.routingDetail?.departureZone || '', [...createRequiredValidators()]),
                arrivalZone: this.fb.control(data?.routingDetail?.arrivalZone || '', [...createRequiredValidators()]),
                departurePort: this.fb.control(data?.routingDetail?.departurePort || '', [...createRequiredValidators()]),
                arrivalPort: this.fb.control(data?.routingDetail?.arrivalPort || '', [...createRequiredValidators()]),
                company: this.fb.control(data?.routingDetail?.company || '', [...createRequiredValidators()]),
                pilotCompany: this.fb.control(data?.routingDetail?.pilotCompany || '', [...createRequiredValidators()]),
                // length: this.fb.control(data?.routingDetail?.length || 0, [...createRequiredValidators()]),
                // width: this.fb.control(data?.routingDetail?.width || 0, [...createRequiredValidators()]),
                // maxDraft: this.fb.control(data?.routingDetail?.maxDraft || 0, [...createRequiredValidators()]),
                // arrivalGauge: this.fb.control(data?.routingDetail?.arrivalGauge || 0, [...createRequiredValidators()]),
                // maxCapacity: this.fb.control(data?.routingDetail?.maxCapacity || 0, [...createRequiredValidators()]),
                // lockType: this.fb.control(data?.routingDetail?.lockType || '', [...createRequiredValidators()]),
                ridCoordinates: this.fb.control(data?.routingDetail?.ridCoordinates || '', [...createRequiredValidators()]),
            }),
            convoyDetail: this.fb.control(data?.convoyDetail || [], [...createRequiredValidators()]),
            documents: this.fb.control(data?.documents || [], [...createRequiredValidators()]),
        });
    }

    saveScheduling(): void {
        this.isLoading$.next(true);
        this.convoys.push(this.convoyForm.value)
        if (this.dateVal === undefined) this.dateVal = this.formatDate(this.filterDate);
        if (this.timeVal === undefined) this.timeVal = String(this.filterTime);
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`;
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
        this.images[this.imageLen] = this.tempImg;
    }

}
