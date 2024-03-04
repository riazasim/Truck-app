import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from 'src/app/core/services/planning.service';
import { VehicleDeleteModalComponent } from '../vehicle-delete-modal/vehicle-delete-modal.component';
import { SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { PageSettingsModel } from 'src/app/core/models/page.model';
import defaultPageSettings from '../../../core/constants/page.constant';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { OrganizationService } from 'src/app/core/services/organization.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleListComponent implements OnChanges, OnInit, OnDestroy {
  readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns = ['sId', 'timeSlot', 'truckLicensePlateFront', 'truckLicensePlateBack', 'goodsBuyer', 'goodsSupplier',
  'goodsName',  'dock', 'operation', 'driverName', 'statusListStatus', 'createdBy', 'clientInstruction', 'actions'];
  dataSource: SchedulingPreviewModel[] = []
  originalSource: SchedulingPreviewModel[] = []
  appliedFilters: any = {};
  /** isContained hides heading paragraph with search and actions in case it's contained anywhere else */
  @Input() isContained: boolean = false;
  @Input() filterDate: Date;
  readonly isComvexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Output() triggerOpenEdit: EventEmitter<any> = new EventEmitter();
  @Output() triggerDeletion: EventEmitter<SchedulingPreviewModel> = new EventEmitter();
  @Output() triggerOpenLogs: EventEmitter<{ view: string, id: number, planning: SchedulingPreviewModel }> = new EventEmitter();

  @Output() readonly triggerAccept: EventEmitter<any> =  new EventEmitter<any>();
  @Output() readonly triggerReject: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerCancellation: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>(); 
  @Output() readonly triggerCheckIn: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();
  @Output() readonly triggerCheckOut: EventEmitter<SchedulingPreviewModel> =  new EventEmitter<SchedulingPreviewModel>();

  pageSettings: PageSettingsModel = {...defaultPageSettings};
  hasReachedEndPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  statuses$: Observable<StatusListModel[]> = this.statusListService.listSid();
  locationChangeSubscription: Subscription;

  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly planningService: PlanningService,
              private readonly statusListService: StatusListService,
              private readonly organizationService: OrganizationService) {}
  
  ngOnInit(): void {
    if (this.router.url.endsWith('vehicle/list')) {
      this.retrievePlannings();
    }
  }

  ngOnChanges(): void {
    if (!this.locationChangeSubscription) {
      this.subscribeForLocationChange(true);
    }
    this.retrievePlannings();
  }

  subscribeForLocationChange(isFirstLoad: boolean = false): void {
    this.locationChangeSubscription = this.organizationService.organization.subscribe((response) => {
      if (response) {
        if (!isFirstLoad) {
          this.isLoading$.next(true);
          this.retrievePlannings();
        }
      }
      isFirstLoad = false;
    });
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(VehicleDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: () => {
          // this.actualBillingProfiles = this.actualBillingProfiles.filter(x => x.paymentAccountId !== data.paymentAccountId);
          // this.billingProfiles$ = of(this.actualBillingProfiles);
          // this.changeDetector.detectChanges();
        }
      });
  }

  applyFilter(target: any, column: string): void {
    if (target.value) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }

    this.retrievePlannings();
  }

  /**
   * 
   * @deprecated
   */
  onTableScroll(e: any) {
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
    // this.dataSource = this.dataSource.concat(this.dataSource);
    }
  }

  onBottomReached(): void {
    this.pageSettings.start = this.pageSettings.start + 20;
    this.retrievePlannings(true);
  }

  retrievePlannings(fetchMore: boolean = false): void {
    if (fetchMore && this.hasReachedEndPage$.getValue() || !this.isContained && !this.router.url.endsWith('vehicle/list')) {
      return;
    }

    if (!fetchMore)  {
      this.pageSettings = {...defaultPageSettings};
      this.dataSource.length = 0;
      this.originalSource.length = 0;
    }

    this.isLoading$.next(true);

    if (!this.filterDate) this.filterDate = new Date();

    this.planningService.list({ schedulingDate: getFormattedDate(this.filterDate), ...this.pageSettings, ...this.appliedFilters })
                        .subscribe(response => {
      if (fetchMore) {
        if (!response.length) {
          this.hasReachedEndPage$.next(true);
          this.isLoading$.next(false);
          return;
        }
        this.originalSource = [...this.originalSource, ...response];
        this.dataSource = [...this.dataSource, ...response];
      } else {
        this.originalSource = response;
        this.dataSource = response;
        this.hasReachedEndPage$.next(false);
      }
      this.isLoading$.next(false);
    });
  }

  redirectAddScheduling(): void {
    this.router.navigate(['../scheduling/add'], { relativeTo: this.route.parent });
  }

  ngOnDestroy(): void {
    this.locationChangeSubscription.unsubscribe();
  }
}
