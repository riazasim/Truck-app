import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsComponent } from './locations.component';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationsAddEditComponent } from './locations-add-edit/locations-add-edit.component';
import { LocationsDeleteModalComponent } from './locations-delete-modal/locations-delete-modal.component';
import { LocationsSuccessComponent } from './locations-success/locations-success.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from '../../shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NoLocationsComponent } from './no-locations/no-locations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LocationsImportModalComponent} from "./locations-import-modal/locations-import-modal.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    LocationsComponent,
    LocationsListComponent,
    LocationsAddEditComponent,
    LocationsDeleteModalComponent,
    LocationsSuccessComponent,
    NoLocationsComponent,
    LocationsImportModalComponent
  ],
    imports: [
        CommonModule,
        LocationsRoutingModule,
        NgScrollbarModule,
        ReactiveFormsModule,
        FormsModule,
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
        MaterialPanelTableModule,
        SearchbarModule,
        SharedModule,
        FontAwesomeModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatTooltipModule
    ]
})
export class LocationsModule { }
