import { ChangeDetectionStrategy, Component, InjectionToken, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavigationMenuConfig, Nullable } from 'src/app/core/models/navigation-menu.model';
import { modeLogoSelector } from 'src/app/store/app-mode/appMode.selector';
import { AppState } from 'src/app/store/app.state';

export const USE_ROLES = new InjectionToken<boolean>('A value that controls if the navigation menu will use role based security or not');

@Component({
    selector: 'navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent {
    modeLogo$: Observable<any> = new Observable<any>();

    constructor(private readonly store: Store<AppState>) {
        this.modeLogo$ = this.store.select(modeLogoSelector);
    }

    @Input()
    public logoSrc: Nullable<string> = null;

    @Input()
    public logoRedirect: Nullable<string> = '../admin/branding';

    @Input()
    public upperMenuConfig: Nullable<NavigationMenuConfig[]> = null;

    @Input()
    public lowerMenuConfig: Nullable<NavigationMenuConfig[]> = null;
}
