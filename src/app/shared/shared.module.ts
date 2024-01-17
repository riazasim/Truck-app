import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconicInputWrapperComponent } from './components/input-wrapper/iconic-input-wrapper.component';
import { IconicPasswordWrapperComponent } from './components/password-wrapper/iconic-password-wrapper.component';
import { IconicSelectWrapperComponent } from './components/select-wrapper/iconic-select-wrapper.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectRefDirective } from './directives/select-ref.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { FilterPipe } from "../core/pipes/filter.pipe";
import { SuccessContainerComponent } from "./components/success-container/success-container.component";
import { EditContainerComponent } from "./components/edit-container/edit-container.component";
import { FullEmptyContainerComponent } from "./components/full-empty-container/full-empty-container.component";
import { ChangeLocationModalComponent } from './components/change-location-modal/change-location-modal.component';
import { CallbackPipe } from '../core/pipes/callback.pipe';
import { SearchbarModule } from './components/searchbar/searchbar.component';
import { ButtonComponent } from './components/button/button.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { TextareaWrapperComponent } from './components/textarea-wrapper/textarea-wrapper.component';



@NgModule({
  declarations: [
    IconicInputWrapperComponent,
    IconicPasswordWrapperComponent,
    IconicSelectWrapperComponent,
    LoaderComponent,
    SelectRefDirective,
    PublicLayoutComponent,
    SuccessContainerComponent,
    FilterPipe,
    EditContainerComponent,
    FullEmptyContainerComponent,
    ChangeLocationModalComponent,
    CallbackPipe,
    ButtonComponent,
    FilterSelectComponent,
    TextareaWrapperComponent
  ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        SearchbarModule,
        MatProgressSpinnerModule
    ],
  exports: [
    IconicInputWrapperComponent,
    IconicPasswordWrapperComponent,
    IconicSelectWrapperComponent,
    LoaderComponent,
    SelectRefDirective,
    PublicLayoutComponent,
    FilterPipe,
    SuccessContainerComponent,
    EditContainerComponent,
    FullEmptyContainerComponent,
    ChangeLocationModalComponent,
    CallbackPipe,
    ButtonComponent,
    FilterSelectComponent,
    TextareaWrapperComponent
  ]
})
export class SharedModule { }
