import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'no-scheduling',
    templateUrl: './no-scheduling.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoSchedulingComponent {
    @Input() userRole: any;
    @Input() mode: string | null;

    // For Debuging
    // ngAfterContentInit(): void {
    //   console.log(this.userRole, this.transportMode)
    // }
}
