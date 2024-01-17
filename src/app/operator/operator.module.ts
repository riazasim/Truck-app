import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorRoutingModule } from './operator-routing.module';
import { OperatorComponent } from './operator.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { LineChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchbarModule } from '../shared/components/searchbar/searchbar.component';
import { StatisticCardV2Module } from '../shared/components/cards/statistic-card-v2/statistic-card-v2.component';
import { OperatorHeaderComponent } from './layout/header/operator-header.component';
import { NavigationMenuComponent } from './layout/navigation-menu/navigation-menu.component';
import { OperatorLayoutComponent } from './layout/operator/opeartor-layout.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    OperatorComponent,
    DashboardComponent,
    OperatorHeaderComponent,
    NavigationMenuComponent,
    OperatorLayoutComponent,
  ],
    imports: [
        CommonModule,
        OperatorRoutingModule,
        SharedModule,
        LineChartModule,
        PieChartModule,
        FontAwesomeModule,
        SearchbarModule,
        StatisticCardV2Module,
        MatBadgeModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule
    ]
})
export class OperatorModule { }
