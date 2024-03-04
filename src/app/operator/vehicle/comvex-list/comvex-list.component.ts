import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PageSettingsModel } from 'src/app/core/models/page.model';
import { ComvexPlanningList, SchedulingPreviewModel } from 'src/app/core/models/scheduling.model';
import defaultPageSettings from '../../../core/constants/page.constant';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from 'src/app/core/services/planning.service';
import { getFormattedDate } from 'src/app/shared/utils/date.functions';
import { StatusListService } from 'src/app/core/services/status-list.service';
import { StatusListModel } from 'src/app/core/models/status-list.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { WaitingTimePipe } from '../waiting-time.pipe';

@Component({
  selector: 'app-comvex-list',
  templateUrl: './comvex-list.component.html',
  styleUrls: ['./comvex-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComvexListComponent implements OnChanges, OnDestroy {
  readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  displayedColumns = ['sId', 'goodsBuyer', 'goodsName', 'status', 'schedulingDate', 'arrival', 
  'waitingTime', 'firstName', 'lastName', 'phoneNumber', 'identityDocumentNumber',
  'truckLicensePlateFront', 'truckLicensePlateBack', 'language', 'goodsNoticeNr', 
  'loadUnloadingPlace', 'country', 'harvestYear', 'quantityBrut', 'quantityEmptyContainer',
  'quantityNet', 'actions'];
  dataSource: ComvexPlanningList[] = []
  originalSource: ComvexPlanningList[] = []
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
  intervalInstance: any;

  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly planningService: PlanningService,
              private readonly statusListService: StatusListService,
              private readonly organizationService: OrganizationService,
              private readonly waitingTimePipe: WaitingTimePipe,
              private readonly cd: ChangeDetectorRef) {}

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

  applyFilter(target: any, column: string): void {
    if (target.value) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }

    this.retrievePlannings();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, (<any>event).previousIndex, (<any>event).currentIndex);
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
    clearInterval(this.intervalInstance);
    if (fetchMore && this.hasReachedEndPage$.getValue() || !this.isContained && !this.router.url.endsWith('vehicle/list')) {
      return;
    }

    if (!fetchMore) {
      this.pageSettings = {...defaultPageSettings};
      this.dataSource.length = 0;
      this.originalSource.length = 0;
    }

    this.isLoading$.next(true);

    if (!this.filterDate) this.filterDate = new Date();

    this.planningService.listComvex({ schedulingDate: getFormattedDate(this.filterDate), ...this.pageSettings, ...this.appliedFilters })
                        .subscribe((response: any) => {
      if (fetchMore) {
        if (!response.length) {
          this.hasReachedEndPage$.next(true);
          this.isLoading$.next(false);
          return;
        }
        this.originalSource = [...this.originalSource, ...this.addWaitingTime(response)];
        this.dataSource = [...this.dataSource, ...this.addWaitingTime(response)];
        this.startFirstTicking();
      } else {
        this.originalSource = this.addWaitingTime(response);
        this.dataSource = this.addWaitingTime(response);
        this.startFirstTicking();
        this.hasReachedEndPage$.next(false);
      }
      this.isLoading$.next(false);
    });
  }

  redirectAddScheduling(): void {
    this.router.navigate(['../scheduling/add'], { relativeTo: this.route.parent });
  }

  startFirstTicking(): void {
    const timing = 60000 - (new Date().getSeconds() * 1000);
    this.intervalInstance = setInterval(() => {
      this.dataSource = this.addWaitingTime(this.dataSource);
      this.cd.detectChanges();
      clearInterval(this.intervalInstance);
      this.startTicking();
    }, timing);
  }

  startTicking(): void {
    this.intervalInstance = setInterval(() => {
      this.dataSource = this.addWaitingTime(this.dataSource);
      this.cd.detectChanges();
    }, 60000);
  }

  private addWaitingTime(list: any[]): any[] {
    return list.map(e => {
      e.waitingTime = this.waitingTimePipe.transform(<string>e.schedulingDate, e.timeSlot);

      return e;
    });
  }

  ngOnDestroy(): void {
    this.locationChangeSubscription.unsubscribe();
    clearInterval(this.intervalInstance);
  }
}
