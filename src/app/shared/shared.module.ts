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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TextareaWrapperComponent } from './components/textarea-wrapper/textarea-wrapper.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OpenImageModalComponent } from './components/open-image-modal/open-image-modal.component';
import { ExtractPropertyPipe } from '../core/pipes/extract-property.pipe';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { CustomTooltipComponent } from './components/custom-tooltip/custom-tooltip.component';
import { CustomTooltipDirective } from './directives/custom-tooltip.directive';
import { SafeHtmlPipe } from '../core/pipes/safe-html.pipe';
import { ToggleComponent } from './components/toggle/toggle.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { MatMenuModule } from '@angular/material/menu';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY.MM.DD',
    },
    display: {
        dateInput: 'YYYY.MM.DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM-YYYY',
    },
};

@NgModule({
    declarations: [
        IconicInputWrapperComponent,
        IconicPasswordWrapperComponent,
        IconicSelectWrapperComponent,
        DatepickerComponent,
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
        TextareaWrapperComponent,
        OpenImageModalComponent,
        ExtractPropertyPipe,
        ActivityLogComponent,
        CustomTooltipComponent,
        CustomTooltipDirective,
        SafeHtmlPipe,
        ToggleComponent,
        TimepickerComponent,
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        SearchbarModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        TranslateModule,
        ReactiveFormsModule,
        MatMenuModule
    ],
    exports: [
        IconicInputWrapperComponent,
        IconicPasswordWrapperComponent,
        IconicSelectWrapperComponent,
        DatepickerComponent,
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
        TextareaWrapperComponent,
        OpenImageModalComponent,
        ExtractPropertyPipe,
        ActivityLogComponent,
        CustomTooltipComponent,
        CustomTooltipDirective,
        SafeHtmlPipe,
        ToggleComponent,
        TimepickerComponent
    ],
    providers: [
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})
export class SharedModule { }
