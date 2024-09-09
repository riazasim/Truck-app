import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
import { createMinLengthValidator, createOptionalRequiredValidators, createRequiredValidators } from 'src/app/shared/validators/generic-validators';
import { PartnerService } from 'src/app/core/services/partner.service';
import { TrainsService } from 'src/app/core/services/trains.service';
import { StationService } from 'src/app/core/services/stations.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from 'src/app/shared/components/modals/warning-modal/warning-modal.component';

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
    stepOneForm: FormGroup;
    stepTwoForm: FormGroup;
    stepThreeForm: FormGroup;
    wagonForm: FormGroup;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    hideEmail$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
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
    wagonsList: any[] = [];
    locomotiveType: any = "";
    stationTypes: any = [];
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
        private readonly cd: ChangeDetectorRef,
        private readonly dialogService: MatDialog
    ) {
        this.getFormatHourSlot = getFormatHourSlot.bind(this);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.initForm();
        // this.initConvoyForm();
        this.retrieveCompanies();
        this.retrieveLocomotives();
        this.addWagons();
        this.addPoints();
        this.retrieveStations();
        this.isLoading$.next(false);
    }

    hideEmail(ev: boolean) {
        localStorage.setItem("userEmail", String(this.stepOneForm.get('userEmail')))
        if (ev) {
            this.stepOneForm.get("userEmail")?.setValidators([...createRequiredValidators()]);
            this.stepOneForm.get("userEmail")?.setValue(String(localStorage.getItem("userEmail")) || "");
        }
        else {
            this.stepOneForm.get("userEmail")?.setValidators([]);
            this.stepOneForm.get("userEmail")?.setValue("");
        }
        this.stepOneForm.get('userEmail')?.updateValueAndValidity();
        this.hideEmail$.next(ev);
    }

    moveItemInFormArray(
        formArray: FormArray,
        fromIndex: number,
        toIndex: number
    ): void {
        const dir = toIndex > fromIndex ? 1 : -1;

        const item = formArray.at(fromIndex);
        for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
            const current = formArray.at(i + dir);
            formArray.setControl(i, current);
        }
        formArray.setControl(toIndex, item);
    }


    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.stations, event.previousIndex, event.currentIndex)
        moveItemInArray(this.stationTypes, event.previousIndex, event.currentIndex)
        this.moveItemInFormArray(this.points, event.previousIndex, event.currentIndex);
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
        // const pickup = this.convoyForm?.get("pickUpPoint")?.value;
        // console.log(this.pickupPoints.indexOf(pickup), pickup.split("(")[1][0], this.pickupPoints)
        // const newArr = this.pickupPoints.filter((item: any) => {
        //     console.log(item.pointType, pickup)
        //     if (item.pointType !== pickup) {
        //         return item
        //     }
        // })
        // this.pickupPoints = newArr;
        // if (this.pickupPoints.length === 1) {
        //     this.addNewWagon$.next(false);
        // }
        this.etpDateTimeVal = `${this.etpDateVal} ${this.etpTimeVal}`;
        this.etdDateTimeVal = `${this.etdDateVal} ${this.etdTimeVal}`;
        this.stepTwoForm.patchValue({ estimatedTimePickUp: this.etpDateTimeVal, estimatedTimeDeliver: this.etdDateTimeVal });
        this.convoys.push({ ...this.stepTwoForm.value, ...this.stepThreeForm.value });
        this.initForm(1);
        this.imageLen++;
        this.tempImg = [];
        // this.initConvoyForm();
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

    retrieveStations() {
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.isStationLoading$.next(true);
        this.stationService.pagination(data).subscribe({
            next: res => {
                console.log(res?.items);
                this.stations = res?.items;
                this.isStationLoading$.next(false);
                this.cd.detectChanges()
            },
            error: err => {
                this.isStationLoading$.next(true);
            }
        })
    }

    OnStationChange(ev: any, index?: any) {
        const newStation = this.stations.find((item: any) => {
            if (Number(item.id) === Number(ev.target?.value)) {
                return item
            }
        })
        this.stationTypes[index] = newStation?.type
    }

    onInputChange(ev: any) {
        this.search = ev?.target?.value
    }

    next(index: any): void {
        if (this.matStepper.selectedIndex === 0) {
        }
        if (index === 1) {
            if (this.points.length < 2) {
                this.dialogService.open(WarningModalComponent, {
                    disableClose: true,
                })
            }
            else {
                console.log("ok")
                const newArr = this.points.value;
                for (let i = 0; i < newArr.length; i++) {
                    newArr[i].pointType = "Touch Point";
                    newArr[i].stationType = this.stationTypes[i];
                }
                newArr[0].pointType = "Start Point";
                newArr[newArr.length - 1].pointType = "End Point";
                this.pickupPoints = newArr.slice(0, -1);
                this.deliveryPoints = newArr.slice(1);
                this.matStepper.selectedIndex = index;
            }
        }
        else {
            this.matStepper.selectedIndex = index;
        }
    }

    onRowDelete(index: any) {
        if (this.points.length > 1) {
            this.points.removeAt(Number(index));
            this.stations.splice(Number(index), 1);
            this.stationTypes.splice(Number(index), 1);
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

    // initConvoyForm(data?: any): void {
    //     this.convoyForm = this.fb.group({
    //         pickUpFromCompany: this.fb.control(data?.pickUpFromCompany || '', [...createRequiredValidators()]),
    //         deliverToCompany: this.fb.control(data?.deliverToCompany || '', [...createRequiredValidators()]),
    //         pickUpPoint: this.fb.control(data?.pickUpPoint || '', [...createRequiredValidators()]),
    //         deliverPoint: this.fb.control(data?.deliverPoint || '', [...createRequiredValidators()]),
    //         estimatedTimePickUp: this.fb.control(data?.estimatedTimePickUp || ''),
    //         estimatedTimeDeliver: this.fb.control(data?.estimatedTimeDeliver || ''),
    //         convoyWagonDetail: this.fb.array([]),
    //         additionalOperator: this.fb.control(data?.additionalOperator || '', [...createRequiredValidators()]),
    //         clientComments: this.fb.control(data?.clientComments || '', [...createRequiredValidators()]),
    //         operatorComments: this.fb.control(data?.operatorComments || '', [...createRequiredValidators()]),
    //     })
    //     if (data?.convoyWagonDetail) {
    //         data.convoyWagonDetail.forEach((wagon: any) => {
    //             this.addWagons(wagon);
    //         });
    //     }
    // }

    get wagons(): any {
        return this.stepTwoForm.get('convoyWagonDetail');
    }

    addWagons(): void {
        const newWagons = this.fb.group({
            wagion: ['', [...createRequiredValidators()]],
            category: ['', [...createRequiredValidators()]],
            subCategory: ['', [...createRequiredValidators()]],
            grossWeight: ['', [...createRequiredValidators()]],
            taraWeight: ['', [...createRequiredValidators()]],
            netWeight: ['', [...createRequiredValidators()]],
            seals: ['', [...createRequiredValidators()]],
        });
        this.wagons.push(newWagons);
    }

    // this.schedulingForm = this.fb.group({
    //     routingDetail: this.fb.group({
    //         locomotiveId: this.fb.control(data?.routingDetail?.locomotiveId || '', [...createRequiredValidators()]),
    //         locomotiveType: this.fb.control(data?.routingDetail?.locomotiveType || ''),
    //         conductorType: this.fb.control(data?.routingDetail?.conductorType || 'With Laras Conductor App', [...createRequiredValidators()]),
    //         userEmail: this.fb.control(data?.routingDetail?.userEmail || ''),
    //         planningRouteDetails: this.fb.array([]),
    //     }),
    //     convoyDetail: this.fb.control(data?.convoyDetail || []),
    //     documents: this.fb.control(data?.documents || []),
    // });

    initForm(index: any = 0): void {
        if (index !== 1) {
            this.schedulingForm = this.fb.group({
                routingDetail: this.fb.group({
                    locomotiveId: this.fb.control(''),
                    locomotiveType: this.fb.control(''),
                    conductorType: this.fb.control(''),
                    userEmail: this.fb.control(''),
                    planningRouteDetails: this.fb.array([]),
                }),
                convoyDetail: this.fb.control([]),
                documents: this.fb.control([]),
            });
            this.stepOneForm = this.fb.group({
                locomotiveId: this.fb.control('', [...createRequiredValidators()]),
                conductorType: this.fb.control('With Laras Conductor App', [...createRequiredValidators()]),
                userEmail: this.fb.control('', [...createRequiredValidators()]),
                planningRouteDetails: this.fb.array([]),
            });
        }
        this.stepTwoForm = this.fb.group({
            pickUpFromCompany: this.fb.control('', [...createRequiredValidators()]),
            deliverToCompany: this.fb.control('', [...createRequiredValidators()]),
            pickUpPoint: this.fb.control('', [...createRequiredValidators()]),
            deliverPoint: this.fb.control('', [...createRequiredValidators()]),
            estimatedTimePickUp: this.fb.control(''),
            estimatedTimeDeliver: this.fb.control(''),
            convoyWagonDetail: this.fb.array([]),
        });

        this.stepThreeForm = this.fb.group({
            clientComments: this.fb.control(''),
            operatorComments: this.fb.control(''),
            additionalOperator: this.fb.control(''),
        });
    }

    get points(): FormArray {
        return this.stepOneForm?.get('planningRouteDetails') as FormArray;
    }


    addPoints(): void {
        const newPoint = this.fb.group({
            planningRouteDetailId: [null],
            pointType: [''],
            stationType: [''],
            station: ['', [...createRequiredValidators()]]
        });
        this.points.push(newPoint);
    }

    // removeContact(): void {
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
    // }

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
        this.stepTwoForm.patchValue({ estimatedTimePickUp: this.etpDateTimeVal, estimatedTimeDeliver: this.etdDateTimeVal });
        this.convoys.push({ ...this.stepTwoForm.value, ...this.stepThreeForm.value });
        this.schedulingForm.patchValue({ convoyDetail: this.convoys, documents: this.images, routingDetail: this.stepOneForm })
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
