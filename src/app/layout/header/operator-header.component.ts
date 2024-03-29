import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Nullable } from 'src/app/core/models/navigation-menu.model';
import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { LocationService } from 'src/app/core/services/location.service';
import { LocationModel } from 'src/app/core/models/location.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject } from 'rxjs';
import { ChangeLocationModalComponent } from 'src/app/shared/components/change-location-modal/change-location-modal.component';

@Component({
  selector: 'operator-header',
  templateUrl: './operator-header.component.html',
  styleUrls: ['./operator-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorHeaderComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input()
  public currentLocation: Nullable<string> = null;

  @Input()
  public logoSrc: Nullable<string> = null;

  @Input()
  public logoRedirect: Nullable<string> = null;

  @Input()
  public optionsTitle: Nullable<string> = 'Options';

  @Input()
  public companyName$: BehaviorSubject<string>;

  public readonly expandBtnIcon: IconProp = faBars as any;
  public readonly closeBtnIcon = faTimes as any; 

  public isMenuClosed = true;

  constructor(public readonly activatedRoute: ActivatedRoute,
              private readonly locationService: LocationService,
              private readonly dialogService: MatDialog,
              private readonly snackBar: MatSnackBar) {}

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
              this.locationService.changeLocation(id).subscribe(() => {
                this.snackBar.open('Success!', 'Close', {
                  duration: 3000,
                  horizontalPosition: 'start',
                  verticalPosition: 'bottom',
                })
                this.isLoading$.next(true);
              })
            } else {
              this.isLoading$.next(true);
            }
          }
        });
    });
  }
}
