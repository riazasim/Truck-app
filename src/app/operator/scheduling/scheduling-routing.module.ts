import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingComponent } from './scheduling.component';
import { RoadPlanningListComponent } from './planning-list/road/road-planning-list.component';
import { EditSchedulingRouteComponent } from './edit-scheduling-route/edit-scheduling-route.component';
import { EditSchedulingConvoyComponent } from './edit-scheduling-convoy/edit-scheduling-convoy.component';
import { EditSchedulingConvoyPageComponent } from './edit-scheduling-convoy/edit-scheduling-convoy-page/edit-scheduling-convoy-page.component';
import { NoRestrictionsComponent } from './no-restrictions/no-restrictions.component';
import { RestrictionsComponent } from './restrictions/restrictions.component';
import { TrainAddSchedulingComponent } from './add-scheduling/train/add-edit-train-scheduling.component';
import { WaterAddSchedulingComponent } from './add-scheduling/water/add-edit-water-scheduling.component';
import { TrainPlanningListComponent } from './planning-list/train/train-planning-list.component';
import { WaterPlanningListComponent } from './planning-list/water/water-planning-list.component';
import { TrainEditSchedulingRouteComponent } from './edit-scheduling-route/train/train-edit-scheduling-route.component';
import { WaterEditSchedulingRouteComponent } from './edit-scheduling-route/water/water-edit-scheduling-route.component';
import { TrainEditSchedulingConvoyComponent } from './edit-scheduling-convoy/train/train-edit-scheduling-convoy.component';
import { TrainEditSchedulingConvoyPageComponent } from './edit-scheduling-convoy/train/train-edit-scheduling-convoy-page/train-edit-scheduling-convoy-page.component';
import { WaterEditSchedulingConvoyPageComponent } from './edit-scheduling-convoy/water/water-edit-scheduling-convoy-page/water-edit-scheduling-convoy-page.component';
import { WaterEditSchedulingConvoyComponent } from './edit-scheduling-convoy/water/water-scheduling-convoy.component';
const appMode = localStorage.getItem("appMode");
var routes: Routes = [
    {
        path: '',
        component: SchedulingComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'add',
                component: AddSchedulingComponent
            },
            {
                path: "edit/:id",
                component: AddSchedulingComponent
            },
            {
                path: 'no-restrictions',
                component: NoRestrictionsComponent
            },
            {
                path: 'restrictions',
                component: RestrictionsComponent
            },
            {
                path: 'success',
                component: SchedulingSuccessComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchedulingRoutingModule { }
