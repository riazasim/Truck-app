import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';

@Component({
    selector: 'app-search-select',
    templateUrl: './iconic-select-search.component.html',
    styleUrl: 'iconic-select-search.component.scss'
})
export class IconicSelectSearchComponent extends GenericWrapperComponent<any, any> {
    search: any = "";

    @Output() selected: EventEmitter<any> = new EventEmitter();


    @Input() formGroup: FormGroup;

    @Input()
    public readonly rightIcon: IconProp = faCaretDown;
    // public rightIcon: IconProp | undefined;

    @Input()
    public leftSvg: string | undefined;

    @Input()
    public formControlName: string;

    @Input()
    public dashboardInp: boolean;

    @Input()
    public isTable: boolean;

    @Input()
    public items: any;

    @Input()
    public loading: boolean | any;

    @Input()
    public isInvalid: boolean;

    @Input()
    public withoutTouched: boolean;

    @Input()
    public showValidationMessageDiv: boolean = true;

    @Input()
    public multiple: boolean = false;

    @Input()
    public styles: any;

    @Input()
    public placeholder: any;

    @Input()
    public value: any;

    onInputChange(ev: any) {
        this.search = ev?.target?.value
    }

    onSelectionChange(ev: any) {
        console.log(ev)
        this.selected.emit(ev)
    }

    @ViewChild('select')
    override set inputRef(ref: any) {
        this._inputRef = ref.ngControl;
    }

}
