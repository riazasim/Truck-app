import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NoSchedulingComponent } from './no-scheduling/no-scheduling.component';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { SchedulingPartnerListComponent } from './scheduling-partner-list/scheduling-partner-list.component';
import { SchedulingViewLogModalComponent } from './scheduling-view-log-modal/scheduling-view-log-modal.component';
import { SchedulingMessageModalComponent } from './scheduling-message-modal/scheduling-message-modal.component';
import { SchedulingComponent } from './scheduling.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SchedulingDeleteModalComponent } from './scheduling-delete-modal/scheduling-delete-modal.component';
import { SchedulingAddProductModalComponent } from './scheduling-add-product-modal/scheduling-add-product-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RolePipesModule } from 'src/app/core/pipes/role-pipes.module';
import { StatisticCardV2Module } from 'src/app/shared/components/cards/statistic-card-v2/statistic-card-v2.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialPanelTableModule } from "../../shared/components/tables/material-panel-table/material-panel-table.component";
import { MatTableModule } from '@angular/material/table';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
    declarations: [
        DashboardComponent,
        NoSchedulingComponent,
        AddSchedulingComponent,
        SchedulingPartnerListComponent,
        SchedulingViewLogModalComponent,
        SchedulingMessageModalComponent,
        SchedulingComponent,
        SchedulingSuccessComponent,
        SchedulingDeleteModalComponent,
        SchedulingAddProductModalComponent,
    ],
    imports: [
        CommonModule,
        SchedulingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        SearchbarModule,
        MatIconModule,
        FontAwesomeModule,
        NgScrollbarModule,
        NgScrollbarReachedModule,
        MatFormFieldModule,
        TranslateModule,
        MatStepperModule,
        MatBadgeModule,
        MatDialogModule,
        RolePipesModule,
        StatisticCardV2Module,
        DragDropModule,
        MatSidenavModule,
        MatMomentDateModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatDatepickerModule,
        MatChipsModule,
        MatTooltipModule,
        MaterialPanelTableModule,
        MatTableModule,
    ],
    providers: [
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS }
      ]
})
export class SchedulingModule { }
