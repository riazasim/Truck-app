import { Component, ContentChild, Input } from '@angular/core';

// import { IconProp } from '@fortawesome/fontawesome-svg-core';
// import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { SelectRefDirective } from '../../directives/select-ref.directive';
import { GenericWrapperComponent } from '../generic-wrapper/generic-wrapper.component';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: '[iconic-select-wrapper]',
  templateUrl: './iconic-select-wrapper.component.html',
  styles: [
    `
    .select-container {
        position: relative;
        flex-grow: 1;
        display: flex;
      }
    .select-decoration {
        position: absolute;
        right: 10px;
        color: black;
      }
    `
  ]
})
export class IconicSelectWrapperComponent extends GenericWrapperComponent<HTMLSelectElement, SelectRefDirective> {

  @Input()
  // public readonly rightIcon: IconProp = faAngleDown;
  public rightIcon: IconProp | undefined;

  @Input()
  public leftSvg: string | undefined;

  @ContentChild(SelectRefDirective)
  override set inputRef(ref: SelectRefDirective) {
    this._inputRef = ref;
  }

}
