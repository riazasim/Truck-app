import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BrandingComponent } from "./branding/branding.component";
import { LocationSettingsComponent } from "./location-settings/location-settings.component";
import { AdminComponent } from "./admin.component";


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'branding',
        component: BrandingComponent
      },
      {
        path: 'location-settings',
        component: LocationSettingsComponent
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule),
      },
      {
        path: 'locations',
        loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule),
      },
      {
        path: 'partners',
        loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
      },
      {
        path: 'operations',
        loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
      },
      {
        path: 'partners-contacts',
        loadChildren: () => import('./partners-contacts/partners-contacts.module').then(m => m.PartnersContactsModule),
      },
      {
        path: 'custom-fields',
        loadChildren: () => import('./custom-fields/custom-fields.module').then(m => m.CustomFieldsModule),
      },
      {
        path: 'message-templates',
        loadChildren: () => import('./message-template/message-template.module').then(m => m.MessageTemplateModule),
      },
      {
        path: 'message-automations',
        loadChildren: () => import('./message-automations/message-automations.module').then(m => m.MessageAutomationsModule),
      },
      {
        path: 'list-management',
        loadChildren: () => import('./list-management/list-management.module').then(m => m.ListManagementModule),
      },
      {
        path: 'message-automations',
        loadChildren: () => import('./message-automations/message-automations.module').then(m => m.MessageAutomationsModule),
      },
      {
        path: 'custom-fields',
        loadChildren: () => import('./custom-fields/custom-fields.module').then(m => m.CustomFieldsModule),
      },
      {
        path: 'report-builder',
        loadChildren: () => import('./report-builder/report-builder.module').then(m => m.ReportBuilderModule),
      },
      {
        path: 'alerts',
        loadChildren: () => import('./alerts/alerts.module').then(m => m.AlertsModule),
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
