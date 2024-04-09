import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { CompanyModel } from 'src/app/core/models/company.model';
// import { CompanyService } from 'src/app/core/services/company.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    isLoading$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
    displayedColumns = ['name'];
    isActive: number = 1;
    dateModal: Date = new Date();
    dateVal: string;
    companies: any[] = [];

    constructor(
        // private readonly companyService: CompanyService,
        private readonly cd: ChangeDetectorRef) {
            this.retrieveCompanies();
        }
    onImgClick(number: number) {
        this.isActive = number
    }
    OnDateChange(value: any) {
        this.dateVal = `${value._i.year}-${value._i.month}-${value._i.date}`
    }
    retrieveCompanies(): void {

        let data={
            "start": 0,
            "length": 0,
            "filters": ["","","","",""],
            "order": [{"dir": "DESC", "column": 0}]
        }
        // this.companyService.pagination(data).subscribe(response => {
        //     this.companies = response.items;
        //     this.cd.detectChanges();
        // })
    }
}
