﻿import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';
import {PageEvent} from "@angular/material/paginator";
import {BehaviorSubject} from "rxjs";
import { PlanningService } from 'src/app/core/services/planning.service';
import { PlanningModel } from 'src/app/core/models/planning.model';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { SchedulingImportModalComponent } from '../scheduling-import-modal/scheduling-import-modal.component';

@Component({
  selector: 'app-planning-list',
  templateUrl: './planning-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns: string[] = ['id', 'manevre', 'vesselId', 'berth', 'products', 'estimatedTimeArrival', 'relativeTimeArrival', 'delay', 'coordinates', 'shipmentStatus'];
    dataSource: PlanningModel[] = [];
    originalSource: PlanningModel[] = [];
    appliedFilters: any = {};

    pageSizeOptions: number[] = [5, 10, 12, 15];
    pageIndex: number;
    pageSize: number;
    length: number;

  constructor(private readonly dialogService: MatDialog,
              private readonly planningService: PlanningService,
              private readonly cd: ChangeDetectorRef) {
                this.retrievePlanningList();
               }


    retrievePlanningList(): void {

        this.pageIndex=0;
        this.pageSize=5;

        let data={
            "start": this.pageIndex,
            "length": this.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        // debugger
        this.planningService.pagination(data).subscribe((response:any) => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.length=response.noTotal;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        let data={
          "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,

            "length": event.pageSize,
            "filters": ["","","","","",""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.planningService.pagination(data).subscribe(response => {
            this.dataSource = response.items;
            this.originalSource = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }

  openDeleteModal(id: number) {
    this.dialogService.open(SchedulingDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
              this.isLoading$.next(true);
              this.planningService.delete(id).subscribe(() => {
              this.retrievePlanningList();
              this.cd.detectChanges();
            })
          }
        }
      });
  }

  applyFilter(target: any, column: string, isMultipleSearch = false): void {
    if (target.value) {
      if (isMultipleSearch) {
        this.appliedFilters['contactFirstName'] = target.value;
        this.appliedFilters['contactLastName'] = target.value;
        this.appliedFilters['contactPhoneRegionCode'] = target.value;
        this.appliedFilters['contactPhone'] = target.value;
        this.appliedFilters['contactEmail'] = target.value;
      } else {
        this.appliedFilters[column] = target.value;
      }
    } else {
      if (isMultipleSearch) {
        delete this.appliedFilters['contactFirstName']
        delete this.appliedFilters['contactLastName']
        delete this.appliedFilters['contactPhoneRegionCode']
        delete this.appliedFilters['contactPhone']
        delete this.appliedFilters['contactEmail']
      } else {
        delete this.appliedFilters[column];
      }
    }

    this.dataSource = this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        if (isMultipleSearch && target.value) {
          expression =
              el['contactFirstName'].concat(' ', el['contactLastName']).toLowerCase().includes(this.appliedFilters['contactFirstName'].toLowerCase()) ||
              el['contactLastName'].concat(' ', el['contactFirstName']).toLowerCase().includes(this.appliedFilters['contactLastName'].toLowerCase()) ||
              el['contactPhoneRegionCode'].toLowerCase().includes(this.appliedFilters['contactPhoneRegionCode'].toLowerCase()) ||
              el['contactPhone'].toLowerCase().includes(this.appliedFilters['contactPhone'].toLowerCase()) ||
              el['contactEmail'].toLowerCase().includes(this.appliedFilters['contactEmail'].toLowerCase());

          return expression;
        } else {
          for (let filter in this.appliedFilters) {
            expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
            if (!expression) break;
          }

          return expression;
        }
      }

      return isMultipleSearch ? true : el[column].includes(target.value);
    });
  }

  sortData(sort: Sort): void {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'manevre': return compare(a.manevre, b.manevre, isAsc);
        case 'vesselId': return compare(a.vesselId, b.vesselId, isAsc);
        case 'berth': return compare(a.berth, b.berth, isAsc);
        case 'products': return compare(a.products, b.products, isAsc);
        case 'estimatedTimeArrival': return compare(a.estimatedTimeArrival, b.estimatedTimeArrival, isAsc);
        case 'relativeTimeArrival': return compare(a.relativeTimeArrival, b.relativeTimeArrival, isAsc);
        case 'delay': return compare(a.delay, b.delay, isAsc);
        case 'coordinates': return compare(a.coordinates, b.coordinates, isAsc);
        case 'shipmentStatus': return compare(a.shipmentStatus, b.shipmentStatus, isAsc);
        default: return 0;
      }
    });
  }
    openImportModal(): void {
        this.isLoading$.next(true);
        this.dialogService.open(SchedulingImportModalComponent, {
            disableClose: true,
            data: {}
        }).afterClosed()
            .subscribe({
                next: (isImported) => {
                    if (isImported) {
                        this.retrievePlanningList();
                    } else {
                        this.isLoading$.next(false);
                    }
                }
            });
    }
}
