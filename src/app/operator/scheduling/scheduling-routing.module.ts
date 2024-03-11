import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingComponent } from './scheduling.component';
import { PlanningListComponent } from './planning-list/planning-list.component';
import { SchedulingViewLogComponent } from './scheduling-view-log/scheduling-view-log.component';
import { EditSchedulingRouteComponent } from './edit-scheduling-route/edit-scheduling-route.component';
import { EditSchedulingConvoyComponent } from './edit-scheduling-convoy/edit-scheduling-convoy.component';
import { EditSchedulingConvoyPageComponent } from './edit-scheduling-convoy/edit-scheduling-convoy-page/edit-scheduling-convoy-page.component';

const routes: Routes = [
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
        path: 'planning-list',
        component: PlanningListComponent
      },
      {
        path: 'add',
        component:  AddSchedulingComponent
      },
      {
        path: 'edit/:id',
        component:  EditSchedulingRouteComponent
      },
      {
        path: 'route/:id/convoy-list',
        component:  EditSchedulingConvoyComponent
      },
      {
        path: 'route/:id/convoy-list/:id',
        component:  EditSchedulingConvoyPageComponent
      },
      {
        path: 'view',
        component:  SchedulingViewLogComponent
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
