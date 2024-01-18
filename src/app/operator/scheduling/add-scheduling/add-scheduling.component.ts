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
import { SchedulingAddProductModalComponent } from '../scheduling-add-product-modal/scheduling-add-product-modal.component';
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
import { getFormatHourSlot } from '../scheduling-box.helper';
import * as moment from 'moment';
import { extractPhoneNumber } from 'src/app/shared/validators/phone-numbers';

@Component({
  selector: 'app-add-scheduling',
  templateUrl: './add-scheduling.component.html',
  styleUrls: ['./add-scheduling.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSchedulingComponent implements OnInit, OnDestroy {
  file1Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  file2Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  file3Text$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @ViewChild('stepper', { static: false }) matStepper : MatStepper;
  firstFormGroup = this.fb.group({
    firstCtrl: ['', []],
  });

  schedulingForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showFileThree$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isLinear = true;
  customers: PartnerModel[] = [];
  operations: OperationModel[] = [];

  transportData: CustomFieldModel[]|undefined;
  cargoData: CustomFieldModel[]|undefined;
  additionalData: CustomFieldModel[]|undefined;

  customFieldTransportData: SchedulingCustomField[] = [];
  customFieldCargoData: SchedulingCustomField[] = [];
  customFieldAdditionalData: SchedulingCustomField[] = [];

  products: ProductModel[] = [];
  listProducts: ProductModel[] = [];
  docks: DockModel[] = [];
  buildings: BuildingModel[] = [];

  customInputsFetched: boolean = false;

  search: string;

  stepOne$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  stepTwo$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  stepThree$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  stepFour$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  stepFive$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  slots: number[] = [];
  ignoreSlots: number[] = [];
  tomorrowSlots: number[] = [];
  today: Date;
  tomorrow: Date;
  selectedSlot$: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);
  selectedCustomer$ : BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);

  getFormatHourSlot: Function;

  id: number;
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
    this.initializeSlots();
    this.id = this.route.snapshot.params['id'];

    combineLatest([
      this.retrieveCustomers(),
      this.retrieveDocks(),
      this.retrieveBuildings(),
      this.retrieveOperations(),
      this.retrieveProducts()
    ])
    .subscribe(([partners, docks, buildings, operations, products]) => {
      this.customers = partners.sort((a,b) => +b.status - +a.status);
      this.docks = docks;
      this.buildings = buildings;
      this.operations = operations;
      this.listProducts = products;
      this.initForm();
      this.subscribeForOperationChanges();
      this.subscribeForSchedulingChanges();
      this.subscribeForDockChanges();
      this.filterName = this.filterName.bind(this);
      this.isLoading$.next(false);
    });
  }

  next(step$: BehaviorSubject<boolean>): void {
    step$.pipe(delay(150), take(1)).subscribe(() => {
      this.matStepper.next();
      if (this.matStepper.selectedIndex === 4) {
        this.stepFive$.next(true);
      }
    })
    step$.next(true)
  }

  subscribeForDockChanges(): void {
    this.schedulingForm.get('dock')?.valueChanges.subscribe((id: number) => {
      const dock = this.docks.find(d => d.id == id);
      this.initializeSlotsAfterDock((<WorkingHoursModel>dock?.workingHour).startTime, (<WorkingHoursModel>dock?.workingHour).endTime);
    });
  }

  subscribeForSchedulingChanges(): void {
    this.schedulingForm.get('schedulingDate')?.valueChanges.subscribe((schedulingDate: Date) => {
      const formattedDate = (<any>moment).isMoment(schedulingDate) ? (<any>schedulingDate).toDate() : new Date(schedulingDate);
      if (this.schedulingForm.get('dock')?.value) {
        const dock = this.docks.find(d => d.id == +this.schedulingForm.get('dock')?.value);
        this.initializeSlotsAfterDock((<WorkingHoursModel>dock?.workingHour).startTime, (<WorkingHoursModel>dock?.workingHour).endTime)
        return;
      }
      const todayEnd = new Date().setHours(23, 59, 59, 999);
      const current = formattedDate.getTime();
      if (current > todayEnd) {
        this.initializeSlots(0);
      } else {
        this.initializeSlots();
      }
    });
  }

  subscribeForOperationChanges(): void {
    this.schedulingForm.get('operation')?.valueChanges.subscribe((id: number) => {
      const operation = this.operations.find(o => o.id === +id);
      this.schedulingForm.get('operationType')?.patchValue(operation?.type);
    })
  }

  retrieveStatuses(): Observable<any> {
    console.log(this.statusListStatus,'listSid')
    return this.statusListStatus.listSid();
  }
  retrieveDocks(): Observable<DockModel[]> {
    return this.dockService.list({});
  }

  retrieveBuildings(): Observable<BuildingModel[]> {
    return this.buildingService.list({});
  }

  getCustomerName(): string {
    if (this.schedulingForm.get('customer')?.value) {
      return '';
    }

    const customer = this.customers.find(c => c.id === +this.schedulingForm.get('customer')?.value);
    return customer?.fullName || '';
  }

  handleSelectionChange(event: StepperSelectionEvent): void {
    switch(event.selectedIndex) {
      case 1:
        this.isLoading$.next(true);
        if (!this.customInputsFetched) {
          this.retrieveCustomFields().subscribe((response: ResponseCustomField|null) => {
            this.transportData = response?.data.transportData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldTransportData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.cargoData = response?.data.cargoData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldCargoData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.additionalData = response?.data.additionalData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldAdditionalData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.customInputsFetched = true;
            this.isLoading$.next(false);
          });
        } else {
          this.isLoading$.next(false);
        }
        break;
      case 2:
        this.isLoading$.next(true);
        if (!this.customInputsFetched) {
          this.retrieveCustomFields().subscribe((response: ResponseCustomField|null) => {
            this.transportData = response?.data.transportData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldTransportData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.cargoData = response?.data.cargoData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldCargoData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.additionalData = response?.data.additionalData.map(t => {
              let input = <CustomFieldModel>this.parseCustomField(t)
              this.customFieldAdditionalData.push(<SchedulingCustomField>{
                customField: input.id,
                name: input.name,
                value: input.type === 'text' ? '' :
                       input.type === 'number' ? 0 :
                       input.type === 'checkbox' ? [] : ''
              });

              return input;
            });
            this.customInputsFetched = true;
          });
        }
        this.retrieveProducts().subscribe((products: ProductModel[]) => {
          this.listProducts = products;
          this.isLoading$.next(false);
        })
        break;
      case 3:
        this.isLoading$.next(true);
        this.isLoading$.next(false);
        break;
    }
  }

  retrieveCustomers(): Observable<PartnerModel[]> {
    return this.partnerService.list({});
  }

  retrieveOperations(): Observable<OperationModel[]> {
    return this.operationService.list({});
  }

  retrieveCustomFields(): Observable<ResponseCustomField|null> {
    return this.customFieldService.list();
  }

  retrieveProducts(): Observable<ProductModel[]> {
    return this.productService.list({});
  }

  filterFavorites(customer: PartnerModel): boolean {
    return !!customer.status;
  }

  filterName(customer: PartnerModel): boolean {
    if (this.search) {
      return customer.fullName.toLowerCase().includes(this.search.trim().toLowerCase());
    }

    return true;
  }

  selectCustomer(customer: PartnerModel): void {
    this.selectedCustomer$.next(customer.fullName);
    this.schedulingForm.get('customer')?.patchValue(customer.id);
  }

  updateCustomFieldTransport(customFieldId: number|undefined, type: string, eventTarget: any): void {
    // console.log(customFieldId, type, eventTarget?.value, eventTarget?.checked)
    const field = this.customFieldTransportData.find(i => i.customField === customFieldId);
    if (field)
    switch (type) {
      case 'text': field.value = eventTarget.value; break;
      case 'number': field.value = +eventTarget.value; break;
      case 'checkbox':
            if (eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) === -1) {
              (<string[]>field.value).push(eventTarget.value);
            }

            if (!eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) > -1) {
              (<string[]>field.value).splice((<string[]>field.value).indexOf(eventTarget.value), 1);
            }
            break;
      case 'radio':
        field.value = eventTarget.value; break;
      case 'time':
        field.value = eventTarget.value; break;
      case 'date':
        field.value = eventTarget.value; break;
    }
  }

  updateCustomFieldCargo(customFieldId: number|undefined, type: string, eventTarget: any): void {
    // console.log(customFieldId, type, eventTarget?.value, eventTarget?.checked)
    const field = this.customFieldCargoData.find(i => i.customField === customFieldId);
    if (field)
    switch (type) {
      case 'text': field.value = eventTarget.value; break;
      case 'number': field.value = +eventTarget.value; break;
      case 'checkbox':
            if (eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) === -1) {
              (<string[]>field.value).push(eventTarget.value);
            }

            if (!eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) > -1) {
              (<string[]>field.value).splice((<string[]>field.value).indexOf(eventTarget.value), 1);
            }
            break;
      case 'radio':
        field.value = eventTarget.value; break;
      case 'time':
        field.value = eventTarget.value; break;
      case 'date':
        field.value = eventTarget.value; break;
    }
  }
  updateCustomFieldAdditional(customFieldId: number|undefined, type: string, eventTarget: any): void {
    // console.log(customFieldId, type, eventTarget?.value, eventTarget?.checked)
    const field = this.customFieldAdditionalData.find(i => i.customField === customFieldId);
    if (field)
    switch (type) {
      case 'text': field.value = eventTarget.value; break;
      case 'number': field.value = +eventTarget.value; break;
      case 'checkbox':
            if (eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) === -1) {
              (<string[]>field.value).push(eventTarget.value);
            }

            if (!eventTarget?.checked && (<string[]>field.value).indexOf(eventTarget.value) > -1) {
              (<string[]>field.value).splice((<string[]>field.value).indexOf(eventTarget.value), 1);
            }
            break;
      case 'radio':
        field.value = eventTarget.value; break;
      case 'time':
        field.value = eventTarget.value; break;
      case 'date':
        field.value = eventTarget.value; break;
    }
  }

  initForm(data?: SchedulingModel): void {
    this.schedulingForm = this.fb.group({
        convoyType:this.fb.control(''),
        eta:this.fb.control(''),
        locationPort:this.fb.control(''),
        zone:this.fb.control(''),
        departurePort:this.fb.control(''),
        arrivalPort:this.fb.control(''),
        pilotCompany:this.fb.control(''),
        width:this.fb.control(''),
        maxDraft:this.fb.control(''),
        aerialGuage:this.fb.control(''),
        capacityMax:this.fb.control(''),
        typeOfLock:this.fb.control(''),
        ship:this.fb.control(''),
        pavilion:this.fb.control(''),
        enginePower:this.fb.control(''),
        loa:this.fb.control(''),
        agent:this.fb.control(''),
        shipOwner:this.fb.control(''),
        purpose:this.fb.control(''),
        trafficType:this.fb.control(''),
        cargo:this.fb.control(''),
        unitNo:this.fb.control(''),
        portOfOrigin:this.fb.control(''),
        observation:this.fb.control(''),
      schedulingDate: this.fb.control(new Date()),
      auto: this.fb.control(''),
      timeSlot: this.fb.control(''),
      customer: this.fb.control(null),
      destination: this.fb.control(''),
      loadingAddress: this.fb.control(''),
      truckLicensePlateFront: this.fb.control(''),
      truckLicensePlateBack: this.fb.control(''),
      driverName: this.fb.control(''),
      driverId: this.fb.control(''),
      phoneNumber: this.fb.control(''),
      phoneRegionCode: this.fb.control(''),
      customFieldTransportData: this.fb.control([]),
      customFieldCargoData: this.fb.control([]),
      products: this.fb.control([]),
      operator: this.fb.control(''),
      clientInstruction: this.fb.control(''),
      operatorMention: this.fb.control(''),
      documents: this.fb.control([]),
      customFieldAdditionalData: this.fb.control([]),
      location: this.fb.control(this.organizationService.organization.getValue()?.locationId),
      warehouse: this.fb.control(null),
      dock: this.fb.control(null),
      operation: this.fb.control(null)
    });
    this.subscribeForOperationChanges();
  }

  saveScheduling(): void {
    this.isLoading$.next(true);
    this.planningService.create(this.parseData(this.schedulingForm.value)).subscribe({
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

  openAddProductModal(product?: ProductModel): void {
      this.dialogService.open(SchedulingAddProductModalComponent,
        {
          disableClose: true,
          data: {
              product,
              products: [...this.listProducts],
              cargoData: this.cargoData,
              customFieldCargoData: [...this.customFieldCargoData]
            }
        }).afterClosed()
        .subscribe({
            next: (body: { product: ProductModel, customFieldCargoData: SchedulingCustomField[] }) => {
                if (body?.product) {
                    this.isLoading$.next(true);
                    this.products.push(body?.product);
                    this.products = [...this.products];
                    if (body?.customFieldCargoData) {
              this.customFieldCargoData = [...body.customFieldCargoData];
            }
            this.isLoading$.next(false);
          }
        }
      });
  }

  removeProduct(index: number): void {
    this.products.splice(index, 1);
  }

  patchFile(files: File[], index: number): void {
    const documents = this.schedulingForm.get('documents')?.value;

    if (typeof documents === 'object' && documents.length) {
      documents[index] = files[0];
      this.schedulingForm.get('documents')?.patchValue(documents);
    } else {
      this.schedulingForm.get('documents')?.patchValue([files[0]]);
    }

    switch(index) {
      case 0: this.file1Text$.next(files[0] ? files[0].name : ''); break;
      case 1: this.file2Text$.next(files[0] ? files[0].name : ''); break;
      case 2: this.file3Text$.next(files[0] ? files[0].name : ''); break;
    }
  }

  private parseData(scheduling: SchedulingModel): SchedulingModel {
    const data = {
      ...scheduling,
      phoneNumber: extractPhoneNumber(scheduling.phoneNumber),
      driverContactNumber: scheduling.phoneNumber,
      phoneRegionCode: scheduling.phoneRegionCode,
      schedulingDate: getFormattedDate(new Date(scheduling.schedulingDate)),
      products: [...this.products],
      customFieldTransportData: this.customFieldTransportData.filter(x => {
        if (typeof x.value === 'object' && !x.value.length) return false;
        if (typeof x.value !== 'object' && !x.value) return false;

        return true;
      }),
      customFieldCargoData: this.customFieldCargoData.filter(x => {
        if (typeof x.value === 'object' && !x.value.length) return false;
        if (typeof x.value !== 'object' && !x.value) return false;

        return true;
      }),
      customFieldAdditionalData: this.customFieldAdditionalData.filter(x => {
        if (typeof x.value === 'object' && !x.value.length) return false;
        if (typeof x.value !== 'object' && !x.value) return false;

        return true;
      }),
      operation: +scheduling.operation,
      location: +scheduling.location,
      warehouse: scheduling.warehouse ? +scheduling.warehouse : null as any,
      dock: scheduling.dock ? +scheduling.dock : null as any,
      customer: +scheduling.customer,
      auto: scheduling.truckLicensePlateFront || scheduling.truckLicensePlateBack,
      timeSlot: scheduling.timeSlot
    }

    return data;
  }

  private initializeSlots(setHour: number | null = null): void {
    this.slots.length = 0;
    this.today = new Date();
    this.tomorrow = new Date(new Date().setDate(this.today.getDate() + 1));

    const today = new Date();
    const hour = !isNaN(<number>setHour) && setHour !== null ? setHour : today.getHours() + 1;

    for (let i = <number>hour; i < 24; i++) {
        if (!this.ignoreSlots.includes(i)) {
            this.slots.push(i);
        }
    }
  }

  private initializeSlotsAfterDock(startTime: string, endTime: string): void {
    this.slots.length = 0;

    let startIndex = +startTime.split(':')[0];
    const endIndex = +endTime.split(':')[0];
    const selectedDate = Date.parse(this.schedulingForm.get('schedulingDate')?.value) ? new Date(this.schedulingForm.get('schedulingDate')?.value) : null;

    const today = new Date();
    const hour = today.getHours() + 1;

    if (selectedDate && selectedDate.getDate() <= today.getDate()) {
      startIndex = +startIndex <= hour ? hour : +startIndex;
    }

    for (let i = startIndex; i <= endIndex; i++) {
        if (!this.ignoreSlots.includes(i)) {
            this.slots.push(i);
        }
    }
  }

  selectSlot(index: number, isTomorrow = false): void {
    if (isNaN(index)) return;

    this.selectedSlot$.next(index);

    const slot = index < 10 ? `0${index}:00:00` : `${index}:00:00`;
    this.schedulingForm.get('timeSlot')?.patchValue(slot);
  }

  private parseCustomField(t: CustomFieldData): CustomFieldModel {
    const data = t.attributes;

    if (data?.customFieldLists?.length) {
      data.customFieldLists = (<ResponseCustomFieldList[]>data.customFieldLists).map(f => <CustomFieldList>f.attributes);
    }

    return <CustomFieldModel>data;
  }

  ngOnDestroy(): void {
    this.stepOne$.unsubscribe();
    this.stepTwo$.unsubscribe();
    this.stepThree$.unsubscribe();
    this.stepFour$.unsubscribe();
    this.stepFive$.unsubscribe();
  }

}
