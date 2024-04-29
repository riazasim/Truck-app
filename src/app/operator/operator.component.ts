import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationModel } from '../core/models/organization.model';
import { AuthService } from '../core/services/auth.service';
import { OrganizationService } from '../core/services/organization.service';
import { BehaviorSubject } from 'rxjs';
import { RolesService } from '../core/services/roles.service';

@Component({
    selector: 'app-operator',
    templateUrl: './operator.component.html'
})
export class OperatorComponent {
    notificationsCount: any;
    optionsTitle: string = 'Options';
    isMenuClosed: boolean = true
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    logoSrc: string = '';
    logoRedirect: string = '';
    currentLocation: string = '';
    companyName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    logoImgSrc: string = '';
    constructor(public activatedRoute: ActivatedRoute,
        organizationService: OrganizationService,
        private readonly authService: AuthService,
        private readonly roleService: RolesService,
        private readonly router: Router) {
        // organizationService.get().subscribe((organization: OrganizationModel | null) => {
        //   this.companyName$.next(<string>organization?.name||'');
        //   this.logoImgSrc = organization?.logo as any;
        // });
    }

    logout(): void {
        this.isLoading$.next(true)
        this.authService.logout().subscribe(() => {
            this.authService.removeAuth();
            this.roleService.removeUserRoles();
            this.router.navigate(['/']);
            this.isLoading$.next(false)
        });
    }
}
