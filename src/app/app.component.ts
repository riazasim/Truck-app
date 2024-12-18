import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { modeLoadingSelector } from './store/app-mode/appMode.selector';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    template: `
    <app-loader [isContainer]="false" *ngIf="(isLoading$ | async)" [fullScreen]="true" message="Changing Mode"></app-loader>
    <ng-container>
      <router-outlet></router-outlet>
    </ng-container>
  `
})
export class AppComponent {
    isLoading$: Observable<boolean> = new Observable<boolean>();
    constructor(
        private readonly store: Store<AppState>
    ) {
        this.isLoading$ = this.store.select(modeLoadingSelector);
    }
}
