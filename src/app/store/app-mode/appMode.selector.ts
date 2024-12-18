import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const appModeSelector = (state: AppState) => state.appMode;

export const modeSelector = createSelector(
    appModeSelector,
    (appMode) => appMode?.mode?.id
)

export const modeLoadingSelector = createSelector(
    appModeSelector,
    (appMode) => appMode?.isLoading
)

export const modeNameSelector = createSelector(
    appModeSelector,
    (appMode) => appMode?.mode?.name
)

export const modeLogoSelector = createSelector(
    appModeSelector,
    (appMode) => appMode?.mode?.transportModeDefaultLogo?.fullpath
)
