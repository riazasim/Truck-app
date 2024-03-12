import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { LocationModel } from 'src/app/core/models/location.model';
import { NativeResponseWrapper } from 'src/app/core/models/response-wrappers.types';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { UserModel } from 'src/app/core/models/user.model';
import { LocationService } from 'src/app/core/services/location.service';
import { UserRoleService } from 'src/app/core/services/user-role.service';
import { UserService } from 'src/app/core/services/user.service';
import {SignupModel} from "../../../core/models/signup.model";
import {handleSuccess} from "../../../shared/utils/success-handling.function";
import {handleError} from "../../../shared/utils/error-handling.function";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-users-add-edit',
  templateUrl: './users-add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ])
    ])
  ]
})
export class UsersAddEditComponent {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedRole$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userForm: UntypedFormGroup;
  displayedColumns = ['name', 'city', 'county', 'country', 'status', 'assigned'];
  dataSource: LocationModel[] = [];
  locations: number[] = [];
  //userRoles: UserRoleModel[] = [];
  //selectedRole = '';
  id: number;
  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: UntypedFormBuilder,
              private locationService: LocationService,
              private readonly snackBar: MatSnackBar,
              private userRolesService: UserRoleService) { }

  ngOnInit(): void {
      this.subscribeForQueryParams();
    // combineLatest([
    //   this.retrieveUserRoles(),
    //   this.retrieveLocations()
    // ]).subscribe(([userRoles, locations]) => {
    //   this.userRoles = userRoles;
    //   this.dataSource = locations;
    //   this.subscribeForQueryParams();
    // })
      // combineLatest([
      //   this.retrieveUserRoles(),
      //   this.retrieveLocations()
      // ]).subscribe(([userRoles, locations]) => {
      //   this.userRoles = userRoles;
      //   this.dataSource = locations;
      //   this.subscribeForQueryParams();
      // })
      this.initForm();
  }

  // toggleLocation(id: number): void {
  //   if (this.locations.includes(id)) {
  //     this.locations = this.locations.filter(location => location !== id);
  //   } else {
  //     this.locations.push(id);
  //   }
  // }

  // retrieveUserRoles(): Observable<UserRoleModel[]> {
  //   return this.userRolesService.list({});
  // }
  //
  // retrieveLocations(): Observable<LocationModel[]> {
  //   return this.locationService.list({})
  // }

  // getAssignedLocations(id: number): void {
  //   this.userService.getLocations(id).subscribe((response: LocationModel[]) => {
  //     if (response) {
  //       this.locations = response.map(el => el.id || 0);
  //     }
  //   });
  // }
    onRoleChange(value: any) {
        this.selectedRole$.next(value.target.value);
    }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      //this.getAssignedLocations(this.id);
      this.userService.get(this.id).subscribe(response => {
        console.log(response)
        this.initForm(response);
        this.selectedRole$.next('DRIVER');
        this.isLoading$.next(false);
     });
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: UserModel = <UserModel>{}): void {

      this.userForm = this.fb.group({
         // userId: this.fb.control(data?.id),
          user:this.fb.group({
              email:this.fb.control(data?.user?.email || '',{nonNullable: false}),
             // data?.user?.roles
              userRole: this.fb.control( data?.user?.userRole || '',{nonNullable: false}),
              status: this.fb.control(data?.user?.status || '',{nonNullable: false}),
          }),
          userSetting:this.fb.group({
              timezone: this.fb.control(data?.userSetting?.timezone || '', {nonNullable: false}),
              firstName: this.fb.control(data?.userSetting?.firstName || '', {nonNullable: false}),
              lastName: this.fb.control(data?.userSetting?.lastName || '', {nonNullable: false}),
              language: this.fb.control(data?.userSetting?.language || '', {nonNullable: false}),
              phone: this.fb.control(data?.userSetting?.phone || '', {nonNullable: false}),
              phoneRegionCode: this.fb.control(data?.userSetting?.phoneRegionCode || '', {nonNullable: false}),
              identityDocumentType: this.fb.control(data?.userSetting?.identityDocumentType || '', {nonNullable: false}),
              idNumber: this.fb.control(data?.userSetting?.idNumber || '', {nonNullable: false})
          })
      });


    // this.userForm = this.fb.group({
    //   fullName: this.fb.control(data?.fullName || '', [Validators.required]),
    //   email: this.fb.control(data?.email || '', [Validators.required]),
    //   status: this.fb.control(data?.status || '', [Validators.required]),
    //   contactNumber: this.fb.control(data?.contactNumber || '', [Validators.required]),
    //   userRole: this.fb.control(data?.userRole || '', [Validators.required]),
    // });
  }


    saveUser(): void {
        this.isLoading$.next(true);
        //console.log('Working...',this.userForm.get('user_id')?.value);
       // if (this.userForm.get('userId')?.value) {
        if (this.id) {
            //alert(this.id);
            //this.userForm.patchValue({{userId:this.id});
           // this.userForm.setValue({'userId':this.id});
            this.userService.edit(this.id,this.userForm.getRawValue()).subscribe(() => {
                this.isLoading$.next(false);
                this.router.navigate(['../../success'], { relativeTo: this.route });
            });
        } else {
            this.userForm.patchValue({user:{roles:[this.userForm.getRawValue().user.roles]}});
            this.userService.create(this.userForm.getRawValue()).subscribe(() => {
                this.isLoading$.next(false);
                this.router.navigate(['../success'], { relativeTo: this.route });
            });
        }
    }



  // private parseData(data: UserModel): UserModel {
  //   data.userRole = +data.userRole;
  //
  //   return data;
  // }

  // toggleLocation(id: number): void {
  // }
  //
  // saveUser(): void {
  // }
}
