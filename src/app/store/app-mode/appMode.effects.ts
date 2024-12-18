import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { OrganizationService } from "src/app/core/services/organization.service";
import { modeChange, modeChangeSuccess } from "./appMode.action";
import { exhaustMap, map } from "rxjs";

@Injectable()
export class AppModeEffects {
    mode$ = createEffect(() => this.actions$.pipe(
        ofType(modeChange),
        exhaustMap(({ mode }) => this.organizationService.changeTransportMode({ "transportModeId": mode }).pipe(
            map(({ transportMode }) => modeChangeSuccess({ mode: transportMode }))
        ))
    ));

    constructor(private actions$: Actions, private organizationService: OrganizationService) { }
}
