import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleComponent } from './vehicle.component';
import { VehicleMenuComponent } from './vehicle-menu/vehicle-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterialPanelTableModule } from 'src/app/shared/components/tables/material-panel-table/material-panel-table.component';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleDeleteModalComponent } from './vehicle-delete-modal/vehicle-delete-modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { ComvexListComponent } from './comvex-list/comvex-list.component';
import { PlanningStatusDropdownComponent } from './planning-status-dropdown/planning-status-dropdown.component';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComvexListReorderComponent } from './comvex-list-reorder/comvex-list-reorder.component';
import { WaitingTimePipe } from './waiting-time.pipe';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    VehicleComponent,
    VehicleMenuComponent,
    VehicleListComponent,
    VehicleDeleteModalComponent,
    ComvexListComponent,
    PlanningStatusDropdownComponent,
    ComvexListReorderComponent,
    WaitingTimePipe
  ],
  exports: [
    VehicleListComponent,
    ComvexListComponent,
    ComvexListReorderComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    TranslateModule,
    NgScrollbarModule,
    NgScrollbarReachedModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialPanelTableModule,
    SearchbarModule,
    SharedModule,
    FontAwesomeModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    DragDropModule
  ],
  providers: [WaitingTimePipe]
})
export class VehicleModule { }
