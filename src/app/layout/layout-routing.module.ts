import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'admin',
                pathMatch: 'full'
            },
            {
                path: 'admin',
                loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
                // canLoad: [CredentialsGuard],
                // data: {
                //     roleGuardData: {
                //         requiredRoles: [],
                //         fallbackRoute: '/sign-in',
                //     },
                //     credentialsGuardData: {
                //         canDeactivate: {
                //             inverse: true
                //         }
                //     }
                // }
            },
            {
                path: 'operator/scheduling',
                loadChildren: () => import('../operator/scheduling/scheduling.module').then(m => m.SchedulingModule),
                // canLoad: [CredentialsGuard],
                // canDeactivate: [CredentialsGuard],
                // data: {
                //   roleGuardData: {
                //     requiredRoles: [USER_TYPE_OPERATOR, USER_TYPE_ADMIN],
                //     fallbackRoute: '/sign-in',
                //   },
                //   credentialsGuardData: {
                //     canDeactivate: {
                //       inverse: false
                //     }
                //   }
                // }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
