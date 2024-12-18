import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { LocationService } from 'src/app/core/services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { ChangeLocationModalComponent } from 'src/app/shared/components/change-location-modal/change-location-modal.component';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { Nullable } from 'src/app/core/models/navigation-menu.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { modeChange } from 'src/app/store/app-mode/appMode.action';
import { modeSelector } from 'src/app/store/app-mode/appMode.selector';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'operator-header',
    templateUrl: './operator-header.component.html',
    styleUrls: ['./operator-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorHeaderComponent {

    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    mode$: Observable<any> = new Observable<any>();
    language$: Observable<string>;
    @Input()
    public logoSrc: Nullable<string> = null;

    @Input()
    public logoRedirect: Nullable<string> = null;

    @Input()
    public optionsTitle: Nullable<string> = 'Options';

    @Input()
    public locationName$: string;
    @Input()
    public companyName$: string;

    public readonly expandBtnIcon: IconProp = faBars as any;
    public readonly closeBtnIcon = faTimes as any;

    public isMenuClosed = true;

    transportModeId: string | null;

    constructor(public readonly activatedRoute: ActivatedRoute,
        private readonly dialogService: MatDialog,
        private readonly locationService: LocationService,
        private readonly snackBar: MatSnackBar,
        private readonly authService: AuthService,
        private readonly organizationService: OrganizationService,
        public localizeService: LocalizeRouterService,
        private readonly store: Store<AppState>
    ) {
        this.language$ = localizeService.routerEvents.asObservable().pipe(startWith(localizeService.parser.currentLang));
        this.transportModeId = organizationService.getAppModeId();
        this.mode$ = this.store.select(modeSelector);
    }

    openChangeLocationModal(): void {
        if (this.isLoading$.value) return;
        this.isLoading$.next(true);
        this.locationService.getLocationsByUser().subscribe({
            next: (response: any) => {
                this.isLoading$.next(false);
                this.dialogService.open(ChangeLocationModalComponent, {
                    disableClose: true,
                    width: 'calc(100% - 400px)',
                    height: 'calc(100% - 100px)',
                    data: { locations: response }
                }).afterClosed()
                    .subscribe({
                        next: (id: number) => {
                            if (id && !isNaN(id)) {
                                this.isLoading$.next(true);
                                this.locationService.changeLocation(id).subscribe({
                                    next: (location: any) => {
                                        this.companyName$ = location?.name;
                                        this.organizationService.organization.next({
                                            ...<any>this.organizationService.organization.getValue(),
                                            locationName: location?.location?.name,
                                            locationId: <number>location.locationId
                                        });
                                        this.snackBar.open('Location changed!', 'Success', {
                                            duration: 3000,
                                            horizontalPosition: 'center',
                                            panelClass: ['success-snackbar'],
                                            verticalPosition: 'top',
                                        });
                                        this.isLoading$.next(false);
                                    },
                                    error: (body) => {
                                        this.snackBar.open(body?.error?.detail, 'Error', {
                                            duration: 3000,
                                            horizontalPosition: 'center',
                                            panelClass: ['error-snackbar'],
                                            verticalPosition: 'top',
                                        });
                                        this.isLoading$.next(false);
                                    }
                                });
                            } else {
                                this.isLoading$.next(false);
                            }
                        }
                    });
            },
            error: (error) => {
                this.isLoading$.next(false);
                this.snackBar.open('Failed to load locations', 'Error', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    panelClass: ['error-snackbar'],
                    verticalPosition: 'top',
                });
            }
        });
    }

    changeTransportMode(ev: any) {
        this.store.dispatch(modeChange({ mode: ev.value }));
        // this.organizationService.changeTransportMode({ "transportModeId": ev.value }).subscribe({
        //   next: res => {
        //     this.organizationService.setAppMode(res.transportMode);
        //   },
        //   error: err => {
        //   }
        // });


    }

}
