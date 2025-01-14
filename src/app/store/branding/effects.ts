import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { OrganizationService } from "src/app/core/services/organization.service";
import { exhaustMap, map } from "rxjs";
import { brandingChange, brandingChangeSuccess } from "./action";

@Injectable()
export class AppModeEffects {
    mode$ = createEffect(() => this.actions$.pipe(
        ofType(brandingChange),
        exhaustMap(({ branding }) => this.organizationService.changeTransportMode({ branding }).pipe(
            map(({ branding }) => brandingChangeSuccess({ branding }))
        ))
    ));

    constructor(private actions$: Actions, private organizationService: OrganizationService) { }
}
