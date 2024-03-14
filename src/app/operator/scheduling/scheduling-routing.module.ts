import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingComponent } from './scheduling.component';
import { PlanningListComponent } from './planning-list/planning-list.component';
import { EditSchedulingRouteComponent } from './edit-scheduling-route/edit-scheduling-route.component';
import { EditSchedulingConvoyComponent } from './edit-scheduling-convoy/edit-scheduling-convoy.component';
import { EditSchedulingConvoyPageComponent } from './edit-scheduling-convoy/edit-scheduling-convoy-page/edit-scheduling-convoy-page.component';
import { SchedulingTransferComponent } from './scheduling-transfer/scheduling-transfer.component';
import { NoRestrictionsComponent } from './no-restrictions/no-restrictions.component';
import { RestrictionsComponent } from './restrictions/restrictions.component';

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
        path: 'transfer',
        component:  SchedulingTransferComponent
      },
      {
        path: 'no-restrictions',
        component:  NoRestrictionsComponent
      },
      {
        path: 'restrictions',
        component:  RestrictionsComponent
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
