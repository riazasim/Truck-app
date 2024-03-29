import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from "./header/admin-header.component";
import { NavigationMenuComponent } from "./navigation-menu/navigation-menu.component";
import { BrandingComponent } from "../admin/branding/branding.component";
import { LocationSettingsComponent } from "../admin/location-settings/location-settings.component";
import { ChangeLocationModalComponent } from "./change-location-modal/change-location-modal.component";
import { CdkMenuModule } from "@angular/cdk/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { OperatorModule } from "../operator/operator.module";
import { SchedulingModule } from '../operator/scheduling/scheduling.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LayoutRoutingModule } from './layout-routing.module';
import { GLobalLayoutComponent } from './global/global-layout.component';
import { LayoutComponent } from './layout.component';




@NgModule({
    declarations: [
        LayoutComponent,
        AdminHeaderComponent,
        NavigationMenuComponent,
        GLobalLayoutComponent,
        ChangeLocationModalComponent,
    ],
    providers: [
        AssetsProviderService,
        LoaderOrchestratorService,
        CredentialsGuard,
    ],
    imports: [
        CommonModule,
        LayoutRoutingModule,
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
        OperatorModule,
        SchedulingModule,
        MatTableModule,
        CdkTableModule,
        MatCheckboxModule
    ]
})
export class LayoutModule { }
