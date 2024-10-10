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
import { getFormatHourSlot } from '../../scheduling-box.helper';
import { PlanningModel, convoyModel } from 'src/app/core/models/planning.model';
import { ShipsService } from 'src/app/core/services/ships.service';
import { ShipModel } from 'src/app/core/models/ship.model';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { MicroService } from 'src/app/core/services/micro.service';
import { PageEvent } from '@angular/material/paginator';
import { ProductService } from 'src/app/core/services/product.service';
import { OperationService } from 'src/app/core/services/operation.service';

@Component({
    selector: 'water-app-add-scheduling',
    templateUrl: './water-add-scheduling.component.html',
    styleUrls: ['./water-add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterAddSchedulingComponent implements OnInit {
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
    isEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

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
    operationType: OperationModel[] = [];
    operator: any[] = [];
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
    stepOneForm: FormGroup;
    stepTwoForm: FormGroup;
    stepThreeForm: FormGroup;

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

    departureZone: any[] = [];
    arrivalZone: any[] = [];
    companies: any[];
    shipType = [
        { id: 1, name: 'SELF PROPELLED' },
        { id: 2, name: 'WITHOUT PROPULSION' },
    ];
    agent = [
        { id: 1, name: 'agent1' },
        { id: 2, name: 'agent2' },
        { id: 3, name: 'agent3' },
    ];
    trafficType = [
        { id: 1, name: 'Export' },
        { id: 2, name: 'Import' },
        { id: 3, name: 'Tranzit' },
        { id: 4, name: 'Cabotaj' },
    ];
    purpose = [
        { id: 1, name: 'Towage' },
        { id: 2, name: 'Unloading' },
        { id: 3, name: 'Loading' },
    ];
    convoyType = [
        { id: 1, name: 'Arrival' },
        { id: 2, name: 'Departure' },
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
        private readonly operationService: OperationService,
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
        this.subscribeForQueryParams();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        // this.initConvoyForm();
        this.isLoading$.next(false);
        this.retrivePorts();
        this.retriveProducts()
    }

    temp() {
        console.log(this.stepTwoForm.value, this.stepTwoForm.valid)
    }

    subscribeForQueryParams(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.isEdit$.next(true);
            this.planningService.getConvoy(this.id).subscribe((shipment: any) => {
                console.log(shipment)
                this.retrieveShips()
                this.retriveCompanines(shipment?.planningWater?.departurePort || 0);
                this.initForm(0, shipment);
                // this.locomotiveType = shipment?.planningRailway?.locomotive?.locomotiveType;
                // if (shipment?.planningRailway?.conductorType === "Without Laras Conductor App") {
                //     this.hideEmail(false)
                // }
                this.isLoading$.next(false);
            });
        } else {
            this.initForm();
            this.isLoading$.next(false);
        }
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


    addPlanning(index: number) {
        this.convoys.push({ ...this.stepTwoForm.value, ...this.stepThreeForm.value })
        this.imageLen++
        this.tempImg = [];
        this.productsList = [];
        this.initForm(1);
        // this.initConvoyForm()
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

    retriveOperations() {
        this.isLoading$.next(true);
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.operationService.pagination(data).subscribe(response => {
            this.operationType = response.items;
            this.isLoading$.next(false);
        })
    }

    retriveOperators() {
        this.isLoading$.next(true);
        const data = {
            "userRole": "ROLE_USER_OPERATOR"
        }
        this.planningService.getTransferData(data).subscribe((response: any) => {
            this.operator = response?.data?.attributes.map((item: any) => {
                return { id: item?.attributes?.user?.id, name: item.attributes?.firstName + " " + item.attributes?.lastName }

            })
            this.isLoading$.next(false)
        })
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value
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


    onDeparturePortChange(ev: any) {
        this.isPortChangeLoading$.next(true);
        let departurePort: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) departurePort = item;
        })
        if (departurePort) {
            this.stepOneForm.patchValue({ ridCoordinates: departurePort?.addrCoordinates || "44.179249,28.649940" })
            // console.log(departurePort?.zones);
            // this.departureZone = departurePort?.zones;
            this.retriveCompanines(departurePort.id);
        }
    }
    onArrivalPortChange(ev: any) {
        let arrivalPort: any;
        this.ports.filter((item: any) => {
            if (Number(item.id) === Number(ev.target.value)) arrivalPort = item;
        })
        if (arrivalPort) {
            // console.log(arrivalPort?.zones);
            // this.arrivalZone = arrivalPort?.zones;
        }
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
                    this.stepOneForm.patchValue({ company: null })
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
            this.retriveOperations();
            this.retriveOperators();
        }
        this.matStepper.selectedIndex = index;
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        // this.schedulingForm.patchValue({ routingDetail: { estimatedTimeArrival: this.dateVal } })
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
            this.stepTwoForm.patchValue({
                width: selectedShip.attributes.width || '',
                maxDraft: selectedShip.attributes.maxDraft || '',
                maxQuantity: selectedShip.attributes.maxCapacity || '',
                arrivalGauge: selectedShip.attributes.aerialGauge || '',
                lockType: selectedShip.attributes.lockType || '',
                shipType: selectedShip.attributes.propulsionType || '',

            });
        }
    }

    onProductChange(ev: any) {
        this.productsList = (ev?.source?.value)
        if (this.id) {
            this.stepTwoForm.patchValue({ products: this.productsList })
        }
        else {
            this.stepTwoForm.patchValue({ products: `[${this.productsList}]` })
        }
    }


    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    // initConvoyForm(data?: convoyModel): void {
    //     this.convoyForm = this.fb.group({
    //         navigationType: this.fb.control(data?.navigationType || '', [...createRequiredValidators()]),
    //         company: this.fb.control(data?.company || '', [...createRequiredValidators()]),
    //         status: this.fb.control(data?.status || '', [...createRequiredValidators()]),
    //         ship: this.fb.control(data?.ship || '', [...createRequiredValidators()]),
    //         shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
    //         pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
    //         enginePower: this.fb.control(data?.enginePower || 0, [...createRequiredValidators()]),
    //         lengthOverall: this.fb.control(data?.lengthOverall || 0, [...createRequiredValidators()]),
    //         width: this.fb.control(data?.width || 0, [...createRequiredValidators()]),
    //         maxDraft: this.fb.control(data?.maxDraft || 0, [...createRequiredValidators()]),
    //         maxQuantity: this.fb.control(data?.maxQuantity || 0, [...createRequiredValidators()]),
    //         agent: this.fb.control(data?.agent || '', [...createRequiredValidators()]),
    //         maneuvering: this.fb.control(data?.maneuvering || '', [...createRequiredValidators()]),
    //         shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
    //         purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
    //         operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
    //         trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
    //         operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
    //         cargo: this.fb.control(data?.cargo || '', [...createRequiredValidators()]),
    //         quantity: this.fb.control(data?.quantity || 0, [...createRequiredValidators()]),
    //         unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
    //         observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
    //         additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
    //         clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
    //         operatorComments: this.fb.control(data?.operatorComments, [...createRequiredValidators()]),
    //         products: this.fb.control(data?.products || "", [...createRequiredValidators()]),
    //         lockType: this.fb.control(data?.lockType || '', [...createRequiredValidators()]),
    //         arrivalGauge: this.fb.control(data?.arrivalGauge || 0, [...createRequiredValidators()]),
    //     })
    // }

    // this.schedulingForm = this.fb.group({
    //     routingDetail: this.fb.group({
    //         convoyType: this.fb.control(''),
    //         // convoyType: this.fb.control(data?.routingDetail?.convoyType || ''),
    //         estimatedTimeArrival: this.fb.control(''),
    //         // locationPort: this.fb.control(data?.routingDetail?.locationPort || ''),
    //         departurePort: this.fb.control(''),
    //         arrivalPort: this.fb.control(''),
    //         company: this.fb.control(''),
    //         pilotCompany: this.fb.control(''),
    //         // length: this.fb.control(data?.routingDetail?.length || 0),
    //         // width: this.fb.control(data?.routingDetail?.width || 0),
    //         // maxDraft: this.fb.control(data?.routingDetail?.maxDraft || 0),
    //         // arrivalGauge: this.fb.control(data?.routingDetail?.arrivalGauge || 0),
    //         // maxCapacity: this.fb.control(data?.routingDetail?.maxCapacity || 0),
    //         // lockType: this.fb.control(data?.routingDetail?.lockType || ''),
    //         ridCoordinates: this.fb.control(''),
    //     }),
    //     convoyDetail: this.fb.control([]),
    //     documents: this.fb.control([]),
    // });

    initForm(index?: any, data?: any): void {
        if (index !== 1) {
            this.stepOneForm = this.fb.group({
                convoyType: this.fb.control({ value: data?.planningWater?.convoyType || '', disabled: data?.planningWater?.convoyType ? true : false }, [...createRequiredValidators()]),
                estimatedTimeArrival: this.fb.control(''),
                departurePort: this.fb.control({ value: data?.planningWater?.departurePort || '', disabled: data?.planningWater?.departurePort ? true : false }, [...createRequiredValidators()]),
                arrivalPort: this.fb.control({ value: data?.planningWater?.arrivalPort || '', disabled: data?.planningWater?.arrivalPort ? true : false }, [...createRequiredValidators()]),
                company: this.fb.control({ value: data?.planningWater?.company || '', disabled: data?.planningWater?.company ? true : false }, [...createRequiredValidators()]),
                pilotCompany: this.fb.control({ value: data?.planningWater?.pilotCompany || '', disabled: data?.planningWater?.pilotCompany ? true : false }, [...createRequiredValidators()]),
                ridCoordinates: this.fb.control({ value: data?.planningWater?.ridCoordinates || '', disabled: data?.planningWater?.ridCoordinates ? true : false }, [...createRequiredValidators()]),
            });
        }
        this.schedulingForm = this.fb.group({
            routingDetail: this.stepOneForm,
            convoyDetail: this.fb.control([]),
            documents: this.fb.control([]),
        });

        const ids = data?.planningWaterShipmentProducts?.map((item: any) => item?.product?.id)
        this.productsList = ids;
        this.stepTwoForm = this.fb.group({
            navigationType: this.fb.control("Fluvial", [...createRequiredValidators()]),
            // company: this.fb.control(data?.pickUpFromCompany?.id || ''),
            ship: this.fb.control(data?.ship?.id || '', [...createRequiredValidators()]),
            shipType: this.fb.control(data?.shipType || '', [...createRequiredValidators()]),
            pavilion: this.fb.control(data?.pavilion || '', [...createRequiredValidators()]),
            enginePower: this.fb.control(data?.enginePower || '', [...createRequiredValidators()]),
            lengthOverall: this.fb.control(data?.lengthOverall || '', [...createRequiredValidators()]),
            width: this.fb.control(data?.width || '', [...createRequiredValidators()]),
            maxDraft: this.fb.control(data?.maxDraft || '', [...createRequiredValidators()]),
            maxQuantity: this.fb.control(data?.maxQuantity || '', [...createRequiredValidators()]),
            shipowner: this.fb.control(data?.shipowner || '', [...createRequiredValidators()]),
            purpose: this.fb.control(data?.purpose || '', [...createRequiredValidators()]),
            operator: this.fb.control(data?.operator || '', [...createRequiredValidators()]),
            trafficType: this.fb.control(data?.trafficType || '', [...createRequiredValidators()]),
            operatonType: this.fb.control(data?.operatonType || '', [...createRequiredValidators()]),
            quantity: this.fb.control(data?.quantity || '', [...createRequiredValidators()]),
            unitNo: this.fb.control(data?.unitNo || '', [...createRequiredValidators()]),
            observation: this.fb.control(data?.observation || '', [...createRequiredValidators()]),
            products: this.fb.control(ids || [], [...createRequiredValidators()]),
            lockType: this.fb.control(data?.lockType || ''),
            arrivalGauge: this.fb.control(data?.aerialGauge || ''),
        });

        this.stepThreeForm = this.fb.group({
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments || ''),
            additionalOperator: this.fb.control(localStorage.getItem("userName")),
        });

    }

    saveScheduling(): void {
        this.isLoading$.next(true);
        this.convoys.push({ ...this.stepTwoForm.value, ...this.stepThreeForm.value })
        if (this.dateVal === undefined) this.dateVal = this.formatDate(this.filterDate);
        if (this.timeVal === undefined) this.timeVal = String(this.filterTime);
        this.dateTimeVal = `${this.dateVal} ${this.timeVal}`;
        this.stepOneForm.patchValue({ estimatedTimeArrival: this.dateTimeVal })
        this.schedulingForm.patchValue({ convoyDetail: this.convoys, documents: this.images, routingDetail: { ...this.stepOneForm.value } })

        if (this.id) {
            console.log(this.stepTwoForm.value)
            this.planningService.editConvoys(this.id, ({ ...this.stepTwoForm.value, ...this.stepThreeForm.value })).subscribe({
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
    }

    patchFile(file: File, index: number): void {
        this.tempImg[index] = file
        this.images[this.imageLen] = this.tempImg;
    }

}
