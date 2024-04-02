import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-scheduling',
  templateUrl: './no-scheduling.component.html'
})
export class NoSchedulingComponent {
    @Input() userRole : string;
}
