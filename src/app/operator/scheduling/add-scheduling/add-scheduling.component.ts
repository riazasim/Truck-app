import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { modeSelector } from 'src/app/store/app-mode/appMode.selector';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-add-scheduling',
    templateUrl: './add-scheduling.component.html',
    styleUrls: ['./add-scheduling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSchedulingComponent {
    mode$: Observable<any> = new Observable<any>();
    constructor( private readonly store: Store<AppState>) {
        this.mode$ = this.store.select(modeSelector);
    }
}
