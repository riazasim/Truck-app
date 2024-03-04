import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { SchedulingComponent } from './scheduling.component';
import { EditSchedulingComponent } from './edit-scheduling/edit-scheduling.component';
import { PlanningListComponent } from './planning-list/planning-list.component';

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
        component:  EditSchedulingComponent
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
