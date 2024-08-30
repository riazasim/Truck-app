import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
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
import { PlanningModel, PointModal, convoyModel } from 'src/app/core/models/planning.model';
import { ShipsService } from 'src/app/core/services/ships.service';
import { MicroService } from 'src/app/core/services/micro.service';
import { ProductService } from 'src/app/core/services/product.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { PartnerService } from 'src/app/core/services/partner.service';
import { TrainsService } from 'src/app/core/services/trains.service';
import { StationService } from 'src/app/core/services/stations.service';

@Component({
    selector: 'train-app-add-scheduling',
    templateUrl: './train-add-scheduling.component.html',
    styleUrls: ['./train-add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainAddSchedulingComponent implements OnInit {
    file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    @ViewChild('stepper', { static: false }) matStepper: MatStepper;
    firstFormGroup = this.fb.group({
        firstCtrl: ['', []],
    });

    schedulingForm: FormGroup;
    convoyForm: FormGroup;
    routingDetailsForm: FormGroup;
    wagonForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isStationTypeChangeLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    selectedSlot$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    selectedCustomer$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    isStationLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isLinear = true;
    customers: PartnerModel[] = [];
    areRouteDetailsDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    addNewWagon$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    companiesList: PartnerModel[] = [];
    locomotives: any;
    convoys: convoyModel[] = [];
    images: any[] = [];
    imageLen: number = 0;
    tempImg: File[] = [];
    customInputsFetched: boolean = false;
    etpDateVal: string;
    etpTimeVal: string;
    etpDateTimeVal: string;
    etdDateVal: string;
    etdTimeVal: string;
    etdDateTimeVal: string;
    search: string;
    getFormatHourSlot: Function;
    pickupPoints: any[] = [];
    deliveryPoints: any[] = [];
    id: number;
    shipsList: any;
    etpDate: Date = new Date();
    etpTime = '00:00:00';
    etdDate: Date = new Date();
    etdTime = '00:00:00';
    rowIndex: number = 1;
    rows: any[] = [this.rowIndex];
    selectedIndex: any = 0;
    noIndex: number = 1;
    no: any[] = [this.noIndex];
    points: any[] = [];
    wagonsList: any[] = [];
    locomotiveType: any = "";
    stationType: any;
    station: any;


    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }
    companies: any[];
    categoryList = [
        { id: 1, name: 'Containers' },
        { id: 2, name: 'Liquids' },
        { id: 3, name: 'Grains' },
        { id: 4, name: 'Fertilizers' },
        { id: 5, name: 'Cement' },
        { id: 6, name: 'Ore' },
        { id: 7, name: 'Coal' },
        { id: 8, name: 'Other' },
    ];
    subCategoryList = [
        { id: 1, name: '40 DC' },
        { id: 2, name: 'Crude oil' },
        { id: 3, name: 'Wheat' },
        { id: 4, name: 'Urea' },
        { id: 5, name: 'B200' },
        { id: 6, name: 'Mangan' },
        { id: 7, name: 'Lignit' },
        { id: 8, name: 'Spercial ' },
    ];
    stationTypes = [
        { id: 1, name: 'Public', value: 'PUBLIC' },
        { id: 2, name: 'Private', value: 'PRIVATE' },
    ];
    stations: any = [];

    constructor(
        private readonly fb: FormBuilder,
        private readonly planningService: PlanningService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly statusListStatus: StatusListService,
        private readonly snackBar: MatSnackBar,
        private readonly trainsService: TrainsService,
        private readonly stationService: StationService,
        private readonly partnerService: PartnerService,
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        this.initConvoyForm();
        this.initPointForm();
        this.isLoading$.next(false);
        this.retrieveCompanies();
        this.retrieveLocomotives();
        this.addWagons();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousIndex === this.rows.length - 1 || event.currentIndex === this.rows.length - 1) {
            if (this.points.length === this.rows.length) {
                this.station = "";
                this.stationType = "";
                moveItemInArray(this.points, event.previousIndex, event.currentIndex);
                moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
                moveItemInArray(this.stations, event.previousIndex, event.currentIndex);
            }
            this.routingDetailsForm.patchValue({ pointType: "Touch Point", stationType: this.stationType || "", station: this.station || "" })
            if (this.routingDetailsForm.valid) {
                console.log("valid")
                this.points.push(this.routingDetailsForm.value);
                this.station = "";
                this.stationType = "";
                moveItemInArray(this.points, event.previousIndex, event.currentIndex);
                moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
                moveItemInArray(this.stations, event.previousIndex, event.currentIndex);
            }
        }
        else {
            moveItemInArray(this.points, event.previousIndex, event.currentIndex);
            moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
            moveItemInArray(this.stations, event.previousIndex, event.currentIndex);
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

    addPlanning() {
        this.areRouteDetailsDone.next(true);
        if (this.etpDateVal === undefined) this.etpDateVal = this.formatDate(this.etpDate);
        if (this.etpTimeVal === undefined) this.etpTimeVal = String(this.etpTime);
        if (this.etdDateVal === undefined) this.etdDateVal = this.formatDate(this.etdDate);
        if (this.etdTimeVal === undefined) this.etdTimeVal = String(this.etdTime);
        const pickup = this.convoyForm?.get("pickUpPoint")?.value;
        // console.log(this.pickupPoints.indexOf(pickup), pickup.split("(")[1][0], this.pickupPoints)
        const newArr = this.pickupPoints.filter((item: any) => {
            console.log(item.pointType, pickup)
            if (item.pointType !== pickup) {
                return item
            }
        })
        this.pickupPoints = newArr;
        if (this.pickupPoints.length === 1) {
            this.addNewWagon$.next(false);
        }
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.convoyForm.patchValue({ estimatedTimePickUp: this.etpDateTimeVal, estimatedTimeDeliver: this.etdDateTimeVal });
        this.convoys.push(this.convoyForm.value);
        this.imageLen++;
        this.tempImg = [];
        this.initConvoyForm();
        this.matStepper.selectedIndex = 1;
    }


    retrieveLocomotives(): void {
        let data = {
            "start": '',
            "length": '',
            "filters": ["", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.trainsService.pagination(data).subscribe(response => {
            this.locomotives = response?.items;
            this.isLoading$.next(false);
        })
    }

    onLocomotiveSelected(ev: any): void {
        const selectedLocomotiveId = ev.target.value
        const selectedLocomotive = this.locomotives.find((locomotive: any) => Number(locomotive.id) === Number(selectedLocomotiveId));
        if (selectedLocomotive) {
            this.locomotiveType = selectedLocomotive?.type;
        }
    }

    retrieveCompanies() {
        this.isLoading$.next(true);
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.partnerService.pagination(data).subscribe(response => {
            this.companiesList = response.items;
            this.isLoading$.next(false);
        })
    }


    onStationTypeChange(ev: any, index: any) {
        this.selectedIndex = index;
        if (index === this.rows.length - 1) {
            this.stationType = ev?.target?.value;
            this.retrieveStations(this.stationType, index);

        }
        else {
            this.points[index].stationType = ev?.target?.value;
            this.retrieveStations(this.points[index].stationType, index);
            this.points[index].station = "";
        }
    }

    retrieveStations(type: any, index: any) {
        this.isStationLoading$.next(true);
        this.stationService.getStationListByType(type).subscribe({
            next: res => {
                if (res?.status !== 'error') {
                    let stationArray: any[] = [];
                    res?.forEach((item: any) => {
                        stationArray.push(item.attributes)
                    });
                    this.stations[index] = stationArray;

                    console.log(this.stations);

                }
                if (this.stations.length === 0) {
                    this.schedulingForm.patchValue({ routingDetail: { station: "" } })
                }
                this.isStationLoading$.next(false);
            },
            error: err => {
                this.isStationLoading$.next(true);
                throw err
            }
        })
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value
    }

    next(index: any): void {
        if (this.matStepper.selectedIndex === 0) {
        }
        if (index === 1) {
            if (this.points.length === this.rows.length) {
                if (this.points.length < 2) {
                    return
                }
                else {
                    for (let i = 0; i < this.points.length; i++) {
                        this.points[i].pointType = `Touch Point ( ${i} )`;
                    }
                    this.points[0].pointType = "Start Point";
                    this.points[this.points.length - 1].pointType = "End Point";
                    this.pickupPoints = this.points.slice(0, -1);
                    this.deliveryPoints = this.points.slice(1);
                    this.matStepper.selectedIndex = index;
                }
            }
            else {
                this.routingDetailsForm.patchValue({ pointType: "Touch Point", stationType: this.stationType || "", station: this.station || "" })
                if (this.routingDetailsForm.valid) {
                    this.points.push(this.routingDetailsForm.value);
                    if (this.points.length < 2) {
                        return
                    }
                    else {
                        for (let i = 0; i < this.points.length; i++) {
                            this.points[i].pointType = `Touch Point ( ${i} )`;
                        }
                        this.points[0].pointType = "Start Point";
                        this.points[this.points.length - 1].pointType = "End Point";
                        this.pickupPoints = this.points.slice(0, -1);
                        this.deliveryPoints = this.points.slice(1);
                        this.matStepper.selectedIndex = index;
                    }
                }
            }
        }
        else {
            this.matStepper.selectedIndex = index;
        }
    }

    onRowDelete(index: any) {
        if (this.points.length > 1) {
            this.points.splice(Number(index), 1);
            this.stations.splice(Number(index), 1);
            this.rows.splice(Number(index), 1);
        }
    }

    OnETPDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.etpDateVal = this.formatDate(filterDate);
    }

    OnETDDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.etdDateVal = this.formatDate(filterDate);
    }
    OnETPTimeChange(value: any) {
        this.etpTimeVal = value
    }
    OnETDTimeChange(value: any) {
        this.etpTimeVal = value
    }

    retrieveStatuses(): Observable<any> {
        return this.statusListStatus.listSid();
    }

    initConvoyForm(data?: any): void {
        this.convoyForm = this.fb.group({
            pickUpFromCompany: this.fb.control(data?.pickUpFromCompany || ''),
            deliverToCompany: this.fb.control(data?.deliverToCompany || ''),
            pickUpPoint: this.fb.control(data?.pickUpPoint || ''),
            deliverPoint: this.fb.control(data?.deliverPoint || ''),
            estimatedTimePickUp: this.fb.control(data?.estimatedTimePickUp || ''),
            estimatedTimeDeliver: this.fb.control(data?.estimatedTimeDeliver || ''),
            convoyWagonDetail: this.fb.array([]),
            additionalOperator: this.fb.control(data?.additionalOperator || ''),
            clientComments: this.fb.control(data?.clientComments || ''),
            operatorComments: this.fb.control(data?.operatorComments),
        })
        if (data?.convoyWagonDetail) {
            data.convoyWagonDetail.forEach((wagon: any) => {
                this.addWagons(wagon);
            });
        }
    }

    get wagons(): any {
        return this.convoyForm.get('convoyWagonDetail');
    }

    addWagons(data?: any): void {
        const newWagons = this.fb.group({
            wagion: [data?.wagion || ''],
            category: [data?.category || ''],
            subCategory: [data?.subCategory || ''],
            grossWeight: [data?.grossWeight || ''],
            taraWeight: [data?.taraWeight || ''],
            netWeight: [data?.netWeight || ''],
            seals: [data?.seals || ''],
        });
        this.wagons.push(newWagons);
    }

    initForm(data?: any): void {
        this.schedulingForm = this.fb.group({
            routingDetail: this.fb.group({
                locomotiveId: this.fb.control(data?.routingDetail?.locomotiveId || ''),
                locomotiveType: this.fb.control(data?.routingDetail?.locomotiveType || ''),
                conductorType: this.fb.control(data?.routingDetail?.conductorType || 'With Laras Conductor App'),
                userEmail: this.fb.control(data?.routingDetail?.userEmail || ''),
                planningRouteDetails: this.fb.control(data?.routingDetail?.planningRouteDetails || []),
            }),
            convoyDetail: this.fb.control(data?.convoyDetail || []),
            documents: this.fb.control(data?.documents || []),
        });
    }

    initPointForm(data?: PointModal): void {
        this.routingDetailsForm = this.fb.group({
            pointType: this.fb.control(data?.pointType),
            stationType: this.fb.control(data?.stationType || '', [...createRequiredValidators()]),
            station: this.fb.control(data?.station || '', [...createRequiredValidators()])
        });
    }


    addPoints(): void {
        this.isStationLoading$.next(true);
        if (this.rows.length <= this.points.length) {
            ++this.selectedIndex;
            this.rows.push(++this.rowIndex);
        }
        else {
            this.routingDetailsForm.patchValue({ pointType: this.stationType || "", stationType: this.stationType || "", station: this.station || "" })
            if (this.routingDetailsForm.valid) {
                this.points.push(this.routingDetailsForm.value);
                this.station = "";
                this.stationType = "";
                ++this.selectedIndex;
                this.rows.push(++this.rowIndex);
            }
        }
    }
    onStationChange(ev: any, index: any) {
        if (index === this.rows.length - 1) {
            this.station = ev?.target?.value;
        }
        else {
            this.points[index].station = ev?.target?.value;
        }
    }

    removeContact(): void {
        // const companyId = this.company$?.value?.id;
        // const contactsArray = this.company$?.value?.contacts;

        // if (companyId && contactsArray && contactsArray.length > 0) {
        //   const contactId = contactsArray[index]?.id; // Get the ID of the contact at the specified index
        //   if (contactId !== null && contactId !== undefined && contactId > -1) {
        //     this.companyService.deleteContact(companyId, contactId).subscribe({
        //       next: () => {
        //         console.log('Contact deleted successfully');
        //         this.contacts.removeAt(index); // Remove the contact from the form array
        //         this.cd.detectChanges();
        //         return this.companyForm.get('contacts');
        //       },
        //       error: error => {
        //         console.error('Error deleting contact:', error);
        //         // Handle error, such as showing an error message to the user
        //       }
        //     });
        //   }
        // } else {
        //   this.contacts.removeAt(index);
        // }
    }

    // onCategoryChange(ev: any, index?: any) {
    //     console.log(index)
    //     if (index === this.no.length - 1) {
    //         this.category = ev?.target?.value;
    //     }
    //     else {
    //         this.wagonsList[index].category = ev?.target?.value;
    //     }
    // }

    // onSubCategoryChange(ev: any, index?: any) {
    //     if (index === this.no.length - 1) {
    //         this.subCategory = ev?.target?.value;
    //     }
    //     else {
    //         this.wagonsList[index].subCategory = ev?.target?.value;
    //     }
    // }

    saveScheduling(): void {
        this.isLoading$.next(true);
        if (this.etpDateVal === undefined) this.etpDateVal = this.formatDate(this.etpDate);
        if (this.etpTimeVal === undefined) this.etpTimeVal = String(this.etpTime);
        if (this.etdDateVal === undefined) this.etdDateVal = this.formatDate(this.etdDate);
        if (this.etdTimeVal === undefined) this.etdTimeVal = String(this.etdTime);
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.convoyForm.patchValue({ estimatedTimePickUp: this.etpDateTimeVal, estimatedTimeDeliver: this.etdDateTimeVal });
        this.convoys.push(this.convoyForm.value);
        this.schedulingForm.patchValue({ convoyDetail: this.convoys, documents: this.images, routingDetail: { planningRouteDetails: this.points } })
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
