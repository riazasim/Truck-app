import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusDeleteModalComponent } from '../status-delete-modal/status-delete-modal.component';
import { StatusListService } from '../../../core/services/status-list.service';
import { StatusListModel, StatusTypeEnum } from '../../../core/models/status-list.model';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListStatusComponent implements OnInit {
  listTitle: string = '';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isLoadingColor$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);
  displayedColumns = ['name', 'type', 'description', 'actions'];
  dataSource: StatusListModel[] = [];
  originalSource: StatusListModel[] = [];
  appliedFilters: any = {};
  isSid: boolean;
  statusType: StatusTypeEnum = StatusTypeEnum.UNKNOWN;
  statusTypeEnum = StatusTypeEnum;
  pageSizeOptions: number[] = [5, 10, 12, 15];
  pageIndex: number;
  pageSize: number;
  length: number;

  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly statusListService: StatusListService,
              private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.decideStatus();
    this.retrieveLists();
  }

  drop(event: CdkDragDrop<any>) {
    if (this.isLoading$.value) return;
    this.isLoading$.next(true);
    const previousItem = this.dataSource[event.currentIndex];

    switch (this.statusType) {
      case StatusTypeEnum.TIMESLOT:
        this.isLoading$.next(false);
        // this.statusListService.updateDockPosition(event.item.data.id,
        //   this.getNextPosition(event.item.data.position, previousItem.position)).subscribe(() => {
        //     this.retrieveLists();
        // });
        break;
      case StatusTypeEnum.SID:
        this.statusListService.updateSidPosition(event.item.data.id,
          this.getNextPosition(event.item.data.position, previousItem.position)).subscribe(() => {
            this.retrieveLists();
        });
        break;
      case StatusTypeEnum.GOODS:
        this.statusListService.updateGoodsPosition(event.item.data.id,
          this.getNextPosition(event.item.data.position, previousItem.position)).subscribe(() => {
            this.retrieveLists();
        });
        break;
    }
  }

  handleUpdateColor(event: any, statusListStatusId: number, index: number): void {
    if (!event?.target?.value) return;
    this.isLoading$.next(true);
    const updatedLoadingColors = this.isLoadingColor$.value.map((c, i) => {
      if (i === index) return true;

      return c;
    })
    this.isLoadingColor$.next(updatedLoadingColors);

    switch (this.statusType) {
      case StatusTypeEnum.TIMESLOT:
        this.isLoadingColor$.next(updatedLoadingColors.map(() => false));
        this.isLoading$.next(false);
        // this.statusListService.updateDockColor(statusListStatusId, event.target.value).subscribe((response: StatusListModel[]) => {
        //   this.processResponse(response);
        // });
        break;
      case StatusTypeEnum.SID:
        this.statusListService.updateSidColor(statusListStatusId, event.target.value).subscribe((response: StatusListModel[]) => {
          this.processResponse(response);
        });
        break;
      case StatusTypeEnum.GOODS:
        this.statusListService.updateGoodsColor(statusListStatusId, event.target.value).subscribe((response: StatusListModel[]) => {
          this.processResponse(response);
        });
        break;
    }
  }

  getNextPosition(currentPosition: number, replacePosition: number): number {
    const step = replacePosition - currentPosition;

    if (step < 0) {
      return (replacePosition - 1) < 0 ? 1 : replacePosition - 1;
    }

    if (step === 0) {
      return currentPosition + 1;
    }

    if (step > 0) {
      return replacePosition + 1;
    }

    return 1;
  }

  openDeleteModal(statusList: StatusListModel): void {
    this.dialogService.open(StatusDeleteModalComponent, {
      disableClose: true,
      data: {
        name: statusList.name
      }
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            switch (this.statusType) {
              case StatusTypeEnum.TIMESLOT:
                this.isLoading$.next(false);
                // this.statusListService.deleteDock(statusList.statusListStatusId).subscribe({
                //   next: () => {
                //     this.retrieveLists();
                //   },
                //   error: () => {
                //     this.isLoading$.next(false);
                //   }
                // })
                break;
              case StatusTypeEnum.SID:
                this.statusListService.deleteSid(statusList.id).subscribe(() => {
                    this.retrieveLists();
                  })
                break;
              case StatusTypeEnum.GOODS:
                this.statusListService.deleteGoods(statusList.statusListStatusId).subscribe({
                  next: () => {
                  this.retrieveLists();
                  },
                  error: () => {
                      this.isLoading$.next(false);
                  }
                })
                break;
            }
          }
        }
      });
  }

  applyFilter(target: any, column: string): void {
    if (target.value) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }

    this.dataSource = this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        for (let filter in this.appliedFilters) {
          expression = el[filter]?.toLowerCase().includes(this.appliedFilters[filter].toLowerCase())
          if (!expression) break;
        }

        return expression;
      }

      if (!target.value) return true;

      return el[column].toLowerCase().includes(target.value.toLowerCase());
    });
  }

  redirectAddList(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  transformHex(stringColor: string) {
    if (!stringColor.startsWith('#')) {
      const ctx = document.createElement('canvas').getContext('2d');
      (ctx as any).fillStyle = stringColor;
      return (ctx as any).fillStyle;
    }

    return stringColor;
  }

  retrieveLists(): void {
    switch (this.statusType) {
      case StatusTypeEnum.TIMESLOT:
        this.listTitle = 'Timeslot Status';
        this.statusListService.listTimeSlots().subscribe((response: StatusListModel[]) => this.processResponse(response))
        break;
      case StatusTypeEnum.SID:
        this.listTitle = 'SID Status';
        this.pageIndex=0;
        this.pageSize=5;

        let data={
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["","","",""],
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.statusListService.paginationSid(data).subscribe(response => {
                 this.dataSource = response.items;
                 this.originalSource = response.items;
                 this.length=response.noTotal;
                 this.isLoading$.next(false);
        })
        break;
      case StatusTypeEnum.GOODS:
        this.listTitle = 'Goods Status';
      this.statusListService.listGoods().subscribe((response: StatusListModel[]) => this.processResponse(response))
        break;
    }
  }

  private decideStatus(): void {
    const isTimeSlot = this.router.url.endsWith('timeslot-status');
    const isSid = this.router.url.endsWith('sid-status');
    const isGoods = this.router.url.endsWith('goods-status');

    switch(true) {
      case isTimeSlot: this.statusType = StatusTypeEnum.TIMESLOT; break;
      case isSid: this.statusType = StatusTypeEnum.SID; break;
      case isGoods: this.statusType = StatusTypeEnum.GOODS; break;
      default: this.statusType = StatusTypeEnum.UNKNOWN; break;
    }
  }

  private processResponse(response: StatusListModel[]): void {
    const sortedList = response.sort((a,b) => a.position - b.position);
    this.dataSource = sortedList;
    this.originalSource = sortedList;
    this.isLoading$.next(false);
    this.isLoadingColor$.next(response.map(() => false));
  }
}
