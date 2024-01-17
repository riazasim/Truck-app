import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SchedulingModel } from 'src/app/core/models/scheduling.model';
import { SchedulingDeleteModalComponent } from '../scheduling-delete-modal/scheduling-delete-modal.component';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared/utils/sort.function';

@Component({
  selector: 'app-scheduling-list',
  templateUrl: './scheduling-list.component.html',
  styleUrls: ['./scheduling-list.component.scss']
})
export class SchedulingListComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displayedColumns = ['shipmentId', 'status', 'loadingPoint', 'unloadingPoint', 'driver', 'frontNr', 'backNr', 'notice', 'actions'];
  dataSource: SchedulingModel[] = []
  originalSource: SchedulingModel[] = []
  appliedFilters: any = {};
  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {
               }

  ngOnInit(): void {
    this.retrieveSchedulings()
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(SchedulingDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            // this.partnersService.delete(id).subscribe(() => {
            //   this.retrievePartners();
            // })
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
          switch(typeof this.appliedFilters[filter]) {
            case 'boolean':
              expression = el[filter] === this.appliedFilters[filter];
              break;
            default:
              expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase())
              break;
          }
          if (!expression) break;
        }

        return expression;
      }

      if (!target.value) return true;

      return el[column]+''.toLowerCase().includes(target.value.toLowerCase());
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
        case 'shipmentId': return compare(a.shipmentId, b.shipmentId, isAsc);
        case 'status': return compare(a.status, b.status, isAsc);
        case 'loadingPoint': return compare(a.loadingPoint, b.loadingPoint, isAsc);
        case 'unloadingPoint': return compare(a.unloadingPoint, b.unloadingPoint, isAsc);
        case 'driver': return compare(a.driver, b.driver, isAsc);
        case 'frontNr': return compare(a.frontNr, b.frontNr, isAsc);
        case 'backNr': return compare(a.backNr, b.backNr, isAsc);
        case 'notice': return compare(a.notice, b.notice, isAsc);
        default: return 0;
      }
    });
  }

  retrieveSchedulings(): void {
    // this.partnersService.list({}).subscribe(response => {
    //   this.dataSource = response;
    //   this.originalSource = response;
    //   this.isLoading$.next(false);
    // })
  }

  redirectAddPartner(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
