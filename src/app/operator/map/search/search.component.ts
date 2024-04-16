import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';
import { MapSerachService } from 'src/app/core/services/map-search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    // @Input() searchData: any[] = [];
    @Output() results: EventEmitter<any> = new EventEmitter<any>()
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date();
    dateVal: string;
    companies: any[] = [];
    statusFilters: string[] = ["Port Queue", "Exit", "Berth", "On Route"];
    filterArr: string[] = []
    pageIndex: number;
    pageSize: number;
    length: number = 0;

    constructor(
        private readonly mapSearchService: MapSerachService,
        private readonly cd: ChangeDetectorRef) {
        this.retrieveCompanies(this.statusFilters);
    }
    onImgClick(number: number) {
        this.isActive = number
    }
    OnDateChange(value: any) {
        this.dateVal = `${value._i.year}-${value._i.month}-${value._i.date}`
    }
    OnStatusCahnge(value: string) {
        if (this.filterArr.includes(value)) {
            const index = this.filterArr.indexOf(value);
            this.filterArr.splice(index, 1);
            this.retrieveCompanies(this.filterArr)
        }
        else {
            this.filterArr.push(value);
            this.retrieveCompanies(this.filterArr)
        }
    }
    retrieveCompanies(filters: string[]): void {
        this.isLoading$.next(true)
        let data = {
            "start": 0,
            "length": 5,
            "filters": ["", "", "", filters, "", "", ""],// portId, orgnaizationId, comapnyId, sidStatus, estimatedTimeArrival, departurePort, arrivalPort
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.results.emit(filters)
        this.mapSearchService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.companies = response.items;
                this.length = response.noTotal;
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
            "filters": ["", "", "", "", "", ""],//["firstname/lastname", "status", "role", "phone", "email"]
            "order": [{ "dir": "DESC", "column": 0 }]
        }
        this.mapSearchService.getMicroPlanningConvoyes(data).subscribe({
            next: response => {
                this.companies = response.items;
                this.length = response.noTotal;
                this.isLoading$.next(false);
                this.cd.detectChanges();
            },
            error: () => {
                this.isLoading$.next(false);
            }
        })
    }
}
