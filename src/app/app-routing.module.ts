import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { LocalizeRouterModule, LocalizeParser, LocalizeRouterSettings, CacheMechanism } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { translateFactory } from './core/factories/translate.factory';

import { CredentialsGuard } from "./core/guards/credentials.guard";
import { USER_TYPE_ADMIN, USER_TYPE_OPERATOR } from "./core/constants/roles.constant";

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        // canLoad: [CredentialsGuard],
        // data: {
        //     roleGuardData: {
        //         requiredRoles: [USER_TYPE_ADMIN],
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
        path: 'operator',
        loadChildren: () => import('./operator/operator.module').then(m => m.OperatorModule),
        // canLoad: [CredentialsGuard],
        // canDeactivate: [CredentialsGuard],
        // data: {
        //     roleGuardData: {
        //         requiredRoles: [],
        //         fallbackRoute: '/sign-in',
        //     },
        //     credentialsGuardData: {
        //         canDeactivate: {
        //             inverse: false
        //         }
        //     }
        // }
    }
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: environment.useHash,
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            // enableTracing: true
        }),
        LocalizeRouterModule.forRoot(routes, {
            parser: {
                provide: LocalizeParser,
                useFactory: translateFactory,
                deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient],
            },
            cacheMechanism: CacheMechanism.Cookie,
            cookieFormat: '{{value}};{{expires:20}};path=/',
            alwaysSetPrefix: true
        }),
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule { }
