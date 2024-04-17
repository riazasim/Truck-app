import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
    public readonly showLoader$: Observable<boolean>;
    notificationsCount: any;
    optionsTitle: string = 'Options';
    isMenuClosed: boolean = true
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    logoSrc: string = '';
    logoImgSrc: string = '';
    logoRedirect: string = '';
    currentLocation: string = '';
    companyName$: BehaviorSubject<string> = new BehaviorSubject<string>('iTruck');
    constructor(
        public activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private router: Router) {
    }

    logout(): void {
        this.isLoading$.next(true)
        this.authService.logout().subscribe(() => {
            this.authService.removeAuth();
            this.router.navigate(['/']);
            this.isLoading$.next(false)
        });
    }

}
