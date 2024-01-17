import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from 'src/app/core/services/partner.service';
import { compare } from 'src/app/shared/utils/sort.function';
import { PartnersDeleteModalComponent } from '../partners-delete-modal/partners-delete-modal.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnersListComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  displayedColumns = ['status', 'fullName', 'partnerType', 'address', 'contactNumber', 'email', 'actions'];
  faStarSolid: IconProp = <IconProp>faStar;
  dataSource: PartnerModel[] = []
  originalSource: PartnerModel[] = []
  appliedFilters: any = {};
  constructor(private readonly dialogService: MatDialog,
              private readonly router: Router,
              private readonly route: ActivatedRoute,
              private readonly partnersService: PartnerService) {
               }

  ngOnInit(): void {
    this.retrievePartners()
  }

  openDeleteModal(id: number): void {
    this.dialogService.open(PartnersDeleteModalComponent, {
      disableClose: true,
      data: {}
    }).afterClosed()
      .subscribe({
        next: (isDelete: boolean) => {
          if (isDelete) {
            this.isLoading$.next(true);
            this.partnersService.delete(id).subscribe(() => {
              this.retrievePartners();
            })
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
        case 'fullName': return compare(a.fullName, b.fullName, isAsc);
        case 'partnerType': return compare(a.partnerType, b.partnerType, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        case 'contactNumber': return compare(a.contactNumber, b.contactNumber, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

  retrievePartners(): void {
    this.partnersService.list({}).subscribe(response => {
      this.dataSource = response;
      this.originalSource = response;
      this.isLoading$.next(false);
    })
  }

  redirectAddPartner(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
