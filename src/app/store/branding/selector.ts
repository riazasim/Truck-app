import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const brandingSelector = (state: AppState) => state.branding;


export const brandingLoadingSelector = createSelector
    (
        brandingSelector,
        (branding) => branding?.isLoading
    )

export const brandingNameSelector = createSelector
    (
        brandingSelector,
        (branding) => branding?.branding?.name
    )

export const brandingLogoSelector = createSelector
    (
        brandingSelector,
        (branding) => branding?.branding?.trasportModeSetting?.transportModeSettingLogo?.fullpath
    )
