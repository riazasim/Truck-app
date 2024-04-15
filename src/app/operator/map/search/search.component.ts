import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapSerachService } from 'src/app/core/services/map-search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    // @Input() searchData: any[] = [];
    @Output() results : EventEmitter<any> = new EventEmitter<any>()
    isLoading$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date();
    dateVal: string;
    companies: any[] = [];
    statusFilters : string[] = ["Port Queue", "Exit", "Berth" , "On Route"];
    filterArr : string[] = []
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
    OnStatusCahnge(value : string){
        if(this.filterArr.includes(value)){
            const index = this.filterArr.indexOf(value);
            this.filterArr.splice(index , 1);
            this.retrieveCompanies(this.filterArr)
        }
        else{
            this.filterArr.push(value);
            this.retrieveCompanies(this.filterArr)
        }
    }
    retrieveCompanies(filters : string[]): void {
        this.isLoading$.next(true)
        let data = {
            "start": 0,
            "length": 0,
            "filters": ["","","",filters,"","",""],// portId, orgnaizationId, comapnyId, sidStatus, estimatedTimeArrival, departurePort, arrivalPort
            "order": [{"dir": "DESC", "column": 0}]
        }
        this.results.emit(filters)
        this.mapSearchService.getMicroPlanningConvoyes(data).subscribe(response => {
            this.companies = response.items;
            this.isLoading$.next(false);
            this.cd.detectChanges();
        })
    }
}
