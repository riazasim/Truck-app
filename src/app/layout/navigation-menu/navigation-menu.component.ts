import { ChangeDetectionStrategy, Component, InjectionToken, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationMenuConfig, Nullable } from 'src/app/core/models/navigation-menu.model';

export const USE_ROLES = new InjectionToken<boolean>('A value that controls if the navigation menu will use role based security or not');

@Component({
    selector: 'navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent {

    constructor(private router: Router) {
    }

    navigate(url: string) {
        this.router.navigateByUrl(url).then(() => {
            console.log(url)
        })
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
