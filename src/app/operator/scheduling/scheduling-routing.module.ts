import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulingComponent } from './scheduling.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';

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
        path: 'add',
        component:  AddSchedulingComponent
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
