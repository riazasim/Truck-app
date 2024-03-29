import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
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
    userRole: string;
    constructor(
        private readonly authService: AuthService,
        private router: Router) {
        this.getUser()
    }
    getUser() {
        this.isLoading$.next(true)
        this.authService.checkCredentials().subscribe({
            next: (res: any) => {
                this.userRole = res?.data?.attributes?.userRole
                console.log(this.userRole)
                this.isLoading$.next(false)
            },
            error: () => {
                this.isLoading$.next(false)
            }
        }
        )
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
