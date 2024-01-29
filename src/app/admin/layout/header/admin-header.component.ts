import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Nullable } from 'src/app/core/models/navigation-menu.model';
import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeLocationModalComponent } from '../change-location-modal/change-location-modal.component';
import { LocationService } from 'src/app/core/services/location.service';
import { LocationModel } from 'src/app/core/models/location.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { OrganizationModel } from 'src/app/core/models/organization.model';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable, startWith } from 'rxjs';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHeaderComponent {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  language$: Observable<string>;

  @Input()
  public logoSrc: Nullable<string> = null;

  @Input()
  public logoRedirect: Nullable<string> = null;

  @Input()
  public optionsTitle: Nullable<string> = 'Options';

  @Input()
  public locationName$: BehaviorSubject<string>;
  @Input()
  public companyName$: BehaviorSubject<string>;

  public readonly expandBtnIcon: IconProp = faBars as any;
  public readonly closeBtnIcon = faTimes as any; 

  public isMenuClosed = true;

  constructor(public readonly activatedRoute: ActivatedRoute,
              private readonly dialogService: MatDialog,
              private readonly locationService: LocationService,
              private readonly snackBar: MatSnackBar,
              private readonly organizationService: OrganizationService,
              public localizeService: LocalizeRouterService) {
                this.language$ = localizeService.routerEvents.asObservable().pipe(startWith(localizeService.parser.currentLang))
              }

  openChangeLocationModal(): void {
    if (this.isLoading$.value) return;
    this.isLoading$.next(true);
    this.locationService.getLocationsByUser().subscribe((response: LocationModel[]) => {
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
                next: (location: LocationModel) => {
                  this.locationName$.next(location.name);
                  this.organizationService.organization.next({
                    ...<OrganizationModel>this.organizationService.organization.getValue(), 
                    locationName: location.name, 
                    locationId: <number>location.locationId
                  })
                this.snackBar.open('Location changed!', 'Success', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  panelClass: ['success-snackbar'],
                  verticalPosition: 'top',
                })
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
              })
            } else {
              this.isLoading$.next(false);
            }
          }
        });
    });
  }
}
