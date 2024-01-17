import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulingRoutingModule } from './scheduling-routing.module';
import { SchedulingListComponent } from './scheduling-list/scheduling-list.component';
import { NoSchedulingComponent } from './no-scheduling/no-scheduling.component';
import { AddSchedulingComponent } from './add-scheduling/add-scheduling.component';
import { SchedulingPartnerListComponent } from './scheduling-partner-list/scheduling-partner-list.component';
import { SchedulingViewLogModalComponent } from './scheduling-view-log-modal/scheduling-view-log-modal.component';
import { SchedulingMessageModalComponent } from './scheduling-message-modal/scheduling-message-modal.component';
import { SchedulingComponent } from './scheduling.component';
import { SchedulingSuccessComponent } from './scheduling-success/scheduling-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchbarModule } from 'src/app/shared/components/searchbar/searchbar.component';
import { SchedulingDeleteModalComponent } from './scheduling-delete-modal/scheduling-delete-modal.component';


@NgModule({
  declarations: [
    SchedulingListComponent,
    NoSchedulingComponent,
    AddSchedulingComponent,
    SchedulingPartnerListComponent,
    SchedulingViewLogModalComponent,
    SchedulingMessageModalComponent,
    SchedulingComponent,
    SchedulingSuccessComponent,
    SchedulingDeleteModalComponent
  ],
  imports: [
    CommonModule,
    SchedulingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SearchbarModule
  ]
})
export class SchedulingModule { }
