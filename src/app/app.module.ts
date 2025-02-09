import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpLoaderFactory } from './core/factories/http-loader.factory';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Location } from "@angular/common";
import { StoreModule } from '@ngrx/store';
import { appModeReducer } from './store/app-mode/appMode.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppModeEffects } from './store/app-mode/appMode.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        HttpClientModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FontAwesomeModule,
        StoreModule.forRoot({ appMode: appModeReducer }),
        EffectsModule.forRoot([AppModeEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode in production
        }),


    ],
    providers: [TranslatePipe, Location],
    bootstrap: [AppComponent]
})
export class AppModule { }
