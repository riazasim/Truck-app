import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrganizationModel } from '../core/models/organization.model';
import { AssetsProviderService } from '../core/services/assets-provider.service';
import { AuthService } from '../core/services/auth.service';
import { LoaderOrchestratorService } from '../core/services/loader-orchestrator.service';
import { OrganizationService } from '../core/services/organization.service';
import { AssetsType } from '../onboarding/onboarding-content-provider.service';
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
        private readonly loaderService: LoaderOrchestratorService,
        public activatedRoute: ActivatedRoute,
        assetsProvider: AssetsProviderService<AssetsType>,
        organizationService: OrganizationService,
        private readonly authService: AuthService,
        private router: Router) {
        // this.showLoader$ = this.loaderService.getLoaderStatus();
        // organizationService.get().subscribe((organization: OrganizationModel | null) => {
        //   this.companyName$.next(organization?.name||'');
        //   this.logoImgSrc = <string>organization?.logo||'';
        //   this.loaderService.hideLoader();
        // });
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
