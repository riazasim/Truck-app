import { ChangeDetectorRef, Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { MicroService } from 'src/app/core/services/micro.service';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    @Output() results: EventEmitter<any> = new EventEmitter()
    @Output() mapLoading$: EventEmitter<boolean> = new EventEmitter(true)
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    isPortsLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)
    isCompaniesLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true)

    timeOptions: any[] = [
        { value: 'ridTime', name: 'RID Time' },
        { value: 'operationsTime', name: 'Operations Time' },
        { value: 'berthTime', name: 'Berth Time' },
        { value: 'WaitingTime', name: 'Waiting Time' },
        { value: 'exitTime', name: 'Exit Time' }
    ];

    timeFilterForm: FormGroup;
    companiesFilterForm: FormGroup;
    sidFilterForm: FormGroup;
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date("");
    dateVal: string;
    resultsArray: any[] = [];
    companies: any[] = [];
    statusFilters: number[] = [];
    pageIndex: number;
    pageSize: number;
    length: number = 0;
    timeFilter: any = {};
    ports: any[] = [];
    portId: number = 0;
    companyId: number = 0;
    arrivalPortId: number = 0;
    departurePortId: number = 0;

    private formatDateObject(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        return formattedDate;
    }


    constructor(
        private readonly microService: MicroService,
        private readonly cd: ChangeDetectorRef,
        private fb: FormBuilder,
    ) {
        this.getResults();
        this.retriveCompanines();
        this.initForms();
        this.OnDateChange(this.dateModal);
    }

    initForms() {
        this.initTimeFilterForm();
        this.initCompanyFiterForm();
        this.initSIDFilterForm();
    }

    retrivePorts() {
        this.microService.getPorts().subscribe({
            next: res => {
                res?.forEach((item: any) => {
                    this.ports.push(item?.attributes);
                });
                this.isPortsLoading$.next(false)
            },
            error: err => {
                throw err;
            }
        })
    }

    retriveCompanines() {
        this.portId = 0;
        this.microService.getCompanies(this.portId).subscribe({
            next: res => {
                res?.forEach((item: any) => {
                    this.companies.push(item?.attributes);
                });
                this.isCompaniesLoading$.next(false);
            },
            error: err => {
                throw err
            }
        })
    }

    onCompaniesChange(ev: any, action: string = "search") {
        if (action === "search") {
            this.companyId = ev?.target?.value;
        }
        if (action === "delete") {
            this.companyId = 0;
            this.portId = 0;
            this.initCompanyFiterForm();
            this.isCompaniesLoading$.next(true);
        }
        this.getResults();
    }

    onSIDChange(ev: any, type: string, action: string = "search") {
        if (action === "search" && type === 'ap') {
            this.arrivalPortId = ev?.target?.value;
        }
        if (action === "search" && type === 'dp') {
            this.departurePortId = ev?.target?.value;
        }
        if (this.departurePortId !== 0 && this.arrivalPortId !== 0) {
            this.getResults(this.dateVal);
        }
        if (action === "delete") {
            this.arrivalPortId = 0;
            this.departurePortId = 0;
            this.getResults();
            this.initSIDFilterForm();
            this.dateModal = new Date();
        }
    }

    onImgClick(number: number) {
        this.isActive = number;
    }

    OnDateChange(value: any) {
        let filterDate = value instanceof Date ? value : new Date(value);
        this.dateVal = this.formatDate(filterDate);
        this.sidFilterForm.patchValue({ estimatedTimeArrival : this.dateVal})
        if(this.sidFilterForm.valid){
            this.getResults(this.dateVal);
        }
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


    OnStatusChange(value: any , action: string = 'search') {
        if(action === 'search'){
            if (this.statusFilters.includes(value)) {
                const index = this.statusFilters.indexOf(value);
                this.statusFilters.splice(index, 1);
                this.getResults();
            }
            else {
                this.statusFilters.push(value);
                this.getResults();
            }
        }
        if(action === 'delete'){
            this.statusFilters = [];
            this.getResults();
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
            this.timeFilter = this.timeFilterForm.value;
            this.getResults()
        }
        if (action === 'delete') {
            this.timeFilter = {};
            this.initTimeFilterForm();
            this.getResults();
        }
    }

    getResults(date: any = ""): void {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        console.log(this.timeFilter)
        let data = {
            "start": 0,
            "length": 5,
            "filters": [this.portId, "", this.companyId, this.statusFilters, date, this.departurePortId, this.arrivalPortId, this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.mapLoading$.emit(false);
                this.results.emit(response.items);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
                this.isLoading$.next(false);
            }
        })
    }



    onPaginateChange(event: PageEvent) {
        this.mapLoading$.emit(true);
        this.isLoading$.next(true);
        let data = {
            "start": event.pageIndex ? event.pageIndex * event.pageSize : event.pageIndex,
            "length": event.pageSize,
            "filters": ["", "", "", this.statusFilters, "", "", "", this.timeFilter],
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.microService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.resultsArray = response.items;
                this.length = response.noFiltered;
                this.results.emit(response.items);
                this.mapLoading$.emit(false);
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.results.emit([]);
                this.mapLoading$.emit(false);
                this.resultsArray = [];
                this.length = 0;
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
    initSIDFilterForm() {
        this.sidFilterForm = this.fb.group({
            estimatedTimeArrival: this.fb.control('', [...createRequiredValidators()]),
            departurePort: this.fb.control('', [...createRequiredValidators()]),
            arrivalPort: this.fb.control('', [...createRequiredValidators()]),
        });
    }
    initCompanyFiterForm() {
        this.companiesFilterForm = this.fb.group({
            portId: this.fb.control('', [...createRequiredValidators()]),
            companyId: this.fb.control('', [...createRequiredValidators()]),
        });
    }

}
