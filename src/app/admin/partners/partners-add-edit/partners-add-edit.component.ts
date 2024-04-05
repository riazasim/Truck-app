import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerDockRelationships, PartnerModel } from 'src/app/core/models/partner.model';
import { PartnerService } from '../../../core/services/partner.service';
import { createEmailValidator } from 'src/app/shared/validators/generic-validators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { animate, transition, trigger, style } from '@angular/animations';
import { DockService } from 'src/app/core/services/dock.service';
import { DockModel } from 'src/app/core/models/dock.model';

@Component({
  selector: 'app-partners-add-edit',
  templateUrl: './partners-add-edit.component.html',
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ])
    ])
  ]
})
export class PartnersAddEditComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  partnerForm: FormGroup;
  id: number;
  step: number = 1;
  docks$: BehaviorSubject<DockModel[]> = new BehaviorSubject<DockModel[]>([]);
  originalSource: DockModel[] = [];
  displayedColumns: string[] = ['name', 'location', 'warehouse', 'access'];
  partnerDocks: number[] = [];
  appliedFilters: any = {};
  constructor(private readonly fb: UntypedFormBuilder,
              private readonly partnerService: PartnerService,
              private readonly dockService: DockService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
                this.subscribeForQueryParams();
               }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      combineLatest([
        this.dockService.list({}),
        this.partnerService.get(this.id)
      ]).subscribe(([docks, partner]: [DockModel[], PartnerModel]) => {
        this.originalSource = docks;
        this.docks$.next(docks);
        this.initForm(partner);
        this.isLoading$.next(false);
      });
    } else {
      /*this.dockService.list({}).subscribe((response: DockModel[]) => {
        this.originalSource = response;
        this.docks$.next(response);
        this.initForm();
        this.isLoading$.next(false);
      });*/
    }
  }

  applyFilter(target: any, column: string): void {
    if (typeof target.value !== 'object' && (target.value || typeof target.value === 'boolean')) {
      this.appliedFilters[column] = target.value;
    } else {
      delete this.appliedFilters[column];
    }

    this.docks$.next(this.originalSource.filter((el: any) => {
      if (Object.keys(this.appliedFilters).length) {
        let expression = false;
        for (let filter in this.appliedFilters) {
          switch(typeof this.appliedFilters[filter]) {
            case 'boolean':
              expression = el[column] === this.appliedFilters[filter];
              break;
            default:
              if (filter === 'location' || filter === 'warehouse') {
                expression = el[filter].name.toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
              } else {
                expression = el[filter].toLowerCase().includes(this.appliedFilters[filter].toLowerCase());
              }
              break;
          }

          if (!expression) break;
        }

        return expression;
      }

      if (!target.value) return true;
      return (['location', 'warehouse'].includes(column) ?
      el[column].name.toLowerCase().includes(target.value) :
      el[column].toLowerCase().includes(target.value.toLowerCase()));
    }));
  }

  setAccess(checked: boolean, id: number): void {
    if (checked && !this.partnerDocks.includes(id)) {
      this.partnerDocks.push(id);
    }

    if (!checked && this.partnerDocks.includes(id)) {
      this.partnerDocks.splice(this.partnerDocks.indexOf(id), 1);
    }
  }

  initForm(data: PartnerModel = <PartnerModel>{}): void {
    this.partnerForm = this.fb.group({
      id: this.fb.control(data?.id),
      fullName: this.fb.control(data?.fullName || '', [Validators.required]),
      email: this.fb.control(data?.email || '', [Validators.required, ...createEmailValidator()]),
      contactNumber: this.fb.control(data?.contactNumber || '', [Validators.required]),
      address: this.fb.control(data?.address || '', [Validators.required]),
      status: this.fb.control(data?.status ?? false, [Validators.required]),
      partnerSpecialStatus: this.fb.control(data?.partnerSpecialStatus || 0, [Validators.required]),
      partnerType: this.fb.control(data?.partnerType || '', [Validators.required]),
      blockSidStatus: this.fb.control(data?.blockSidStatus ?? false, []),
      partnerDockRelationships: this.fb.control(data?.partnerDockRelationships || [])
    });

    if ((<number[]>data.docks).length) {
      this.partnerDocks = (<number[]>data.docks);
    }
  }

  savePartner(): void {
    this.isLoading$.next(true);
    if (this.partnerForm.get('id')?.value) {
      this.partnerService.edit(this.id, this.parseData(this.partnerForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../../success'], { relativeTo: this.route });
      });
    } else {
      this.partnerService.create(this.parseData(this.partnerForm.value)).subscribe(() => {
        this.isLoading$.next(false);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
    }
  }

  private parseData(data: PartnerModel): PartnerModel {
    if (!data.id) delete data.id;

    data.partnerDockRelationships = [...this.partnerDocks];

    return data;
  }
}
