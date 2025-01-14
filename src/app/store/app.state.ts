import { AppModeState } from "./app-mode/appMode.reducer";
import { BrandingState } from "./branding/reducer";

export interface AppState {
    appMode: AppModeState,
    branding: BrandingState
}
