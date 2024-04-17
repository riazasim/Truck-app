import { ChangeDetectorRef, Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { MapSerachService } from 'src/app/core/services/map-search.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    @Output() results: EventEmitter<any> = new EventEmitter()
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)

    timeOptions: any[] = [
        { value: 'sidTime', name: 'SID Time' },
        { value: 'operationTime', name: 'Operation Time' },
        { value: 'WaitingTime', name: 'Waiting Time' },
        { value: 'exitTime', name: 'Exit Time' }
    ];

    timeFilterForm: FormGroup;
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date();
    dateVal: string;
    companies: any[] = [];
    statusFilters: string[] = []
    pageIndex: number;
    pageSize: number;
    length: number = 0;
    timeFilter: any = {};

    constructor(
        private readonly mapSearchService: MapSerachService,
        private readonly cd: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.retrieveCompanies();
        this.initTimeFilterForm();
        this.OnTimeChange()
    }

    onImgClick(number: number) {
        this.isActive = number
    }

    OnDateChange(value: any) {
        this.dateVal = `${value._i.year}-${value._i.month}-${value._i.date}`
    }

    OnStatusCahnge(value: string) {
        if (this.statusFilters.includes(value)) {
            const index = this.statusFilters.indexOf(value);
            this.statusFilters.splice(index, 1);
            this.retrieveCompanies()
        }
        else {
            this.statusFilters.push(value);
            this.retrieveCompanies()
        }
    }

    OnTimeChange(action: string = 'search') {
        if (this.timeFilterForm.controls['clauseBy'].value === 'greaterThan') {
            this.timeFilterForm.patchValue({ lessThanVal: 0 });
        }
        if (this.timeFilterForm.controls['clauseBy'].value === 'lessThan') {
            this.timeFilterForm.patchValue({ greaterThanVal: 0 });
        }
        if (this.timeFilterForm.valid && action === 'search') {
            console.log(this.timeFilterForm.value)
            this.timeFilter = this.timeFilterForm.value;
            this.retrieveCompanies()
        }
        if (action === 'delete') {
            this.timeFilter = {};
            this.initTimeFilterForm();
            this.retrieveCompanies();
        }
    }

    retrieveCompanies(): void {
        this.isLoading$.next(true)
        let data = {
            "start": 0,
            "length": 5,
            "filters": ["", "", "", this.statusFilters, "", "", "", this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.results.emit({ statusFilters: this.statusFilters, timeFilter: this.timeFilter })
        this.mapSearchService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.companies = response.items;
                this.length = response.noFiltered;
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.isLoading$.next(false);
            }
        })
    }

    onPaginateChange(event: PageEvent) {
        this.isLoading$.next(true);
        let data = {
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
            "length": event.pageSize,
            "filters": ["", "", "", "", "", ""],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.mapSearchService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.companies = response.items;
                this.length = response.noFiltered;
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.isLoading$.next(false);
            }
        })
    }

    initTimeFilterForm() {
        this.timeFilterForm = this.fb.group({
            filterByTime: this.fb.control('', [...createRequiredValidators()]),
            searchBy: this.fb.control('', [...createRequiredValidators()]),
            clauseBy: this.fb.control('between', [...createRequiredValidators()]),
            greaterThanVal: this.fb.control('', [...createRequiredValidators()]),
            lessThanVal: this.fb.control('', [...createRequiredValidators()]),
        });
    }

}
