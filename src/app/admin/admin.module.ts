import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminComponent } from "./admin.component";
import { AdminHeaderComponent } from "./layout/header/admin-header.component";
import { AdminLayoutComponent } from "./layout/admin/admin-layout.component";
import { NavigationMenuComponent } from "./layout/navigation-menu/navigation-menu.component";
import { BrandingComponent } from "./branding/branding.component";
import { LocationSettingsComponent } from "./location-settings/location-settings.component";
import { ChangeLocationModalComponent } from "./layout/change-location-modal/change-location-modal.component";
import { CdkMenuModule } from "@angular/cdk/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { RolePipesModule } from "../core/pipes/role-pipes.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SearchbarModule } from "../shared/components/searchbar/searchbar.component";
import { SharedModule } from "../shared/shared.module";
import { AssetsProviderService } from "../core/services/assets-provider.service";
import { LoaderOrchestratorService } from "../core/services/loader-orchestrator.service";
import { CredentialsGuard } from "../core/guards/credentials.guard";
import { LineChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { StatisticCardV2Module } from "../shared/components/cards/statistic-card-v2/statistic-card-v2.component";
import { CardModule } from "../shared/components/cards/card.module";
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";
import {TranslateModule} from "@ngx-translate/core";




@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    AdminHeaderComponent,
    NavigationMenuComponent,
    AdminLayoutComponent,
    BrandingComponent,
    LocationSettingsComponent,
    ChangeLocationModalComponent,
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        CdkMenuModule,
        MatSnackBarModule,
        FormsModule,
        MatBadgeModule,
        MatDialogModule,
        RolePipesModule,
        StatisticCardV2Module,
        CardModule,
        FontAwesomeModule,
        SearchbarModule,
        SharedModule,
        LineChartModule,
        PieChartModule,
        HttpClientModule,
        TranslateModule,
        MatMenuModule,
        ReactiveFormsModule,
    ],
  providers: [
    AssetsProviderService,
    LoaderOrchestratorService,
    CredentialsGuard,
  ]
})
export class AdminModule { }
