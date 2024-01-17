import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsAddEditComponent } from './locations-add-edit/locations-add-edit.component';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationsSuccessComponent } from './locations-success/locations-success.component';
import { LocationsComponent } from './locations.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: LocationsListComponent
      },
      {
        path: 'success',
        component: LocationsSuccessComponent
      },
      {
        path: 'add',
        component: LocationsAddEditComponent
      },
      {
        path: 'edit/:id',
        component: LocationsAddEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
