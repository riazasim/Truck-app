import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleMenuComponent } from './vehicle-menu/vehicle-menu.component';
import { VehicleComponent } from './vehicle.component';
import { comvexListGuard } from 'src/app/core/guards/comvex-list.guard';
import { ComvexListComponent } from './comvex-list/comvex-list.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleComponent,
    children: [
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
      },
      {
        path: 'menu',
        component: VehicleMenuComponent
      },
      {
        path: 'list',
        component: VehicleListComponent,
        canActivate: [comvexListGuard]
      },
      {
        path: 'list-comvex',
        component: ComvexListComponent,
        canActivate: [comvexListGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
