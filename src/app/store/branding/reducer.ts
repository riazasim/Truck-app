import { createReducer, on } from "@ngrx/store";
import { AppMode } from "../app-mode/appMode.reducer";
import { brandingChange, brandingChangeSuccess, brandingLoad } from "./action";

export interface Branding {
    id?: number;
    name: string;
    imgLogo: string | File | Blob | null;
    imgCover: string | File | Blob | null;
    bookingFormIsActivated: boolean;
    privacyLink: string | null;
    location?: any;
    trasportModeSetting?: {
        id?: number;
        transportMode?: AppMode;
        transportModeSettingLogo?: {
            fullpath?: string
        }
    };
}


export interface BrandingState {
    branding: Branding | null;
    isLoading: boolean;
}


const localBranding = (JSON.parse(localStorage.getItem("branding") || "{}") as Branding | null) || {
    "id": 1,
    "name": "Transport Lares-1",
    "imgLogo": null,
    "imgCover": null,
    "bookingFormIsActivated": false,
    "privacyLink": null,
    "location": null,
    "trasportModeSetting": {
        "id": 3,
        "transportMode": {
            "id": "3",
            "name": "WATER",
            "description": null,
            "transportModeDefaultLogo": {
                "fullpath": "https:\/\/transport.lares.ro\/uploads\/logos1726032170-transportModeLogo-66e1292a229bd.jpg"
            }
        },
        "transportModeSettingLogo": {
            "fullpath": "https:\/\/transport.lares.ro\/uploads\/logos1726032170-transportModeLogo-66e1292a229bd.jpg"
        }
    }
};

const initialState: BrandingState = {
    branding: localBranding,
    isLoading: false
};




export const brandingReducer = createReducer(
    initialState,
    on(brandingChange, (state) => ({ ...state, isLoading: true })),
    on(brandingChangeSuccess, (state, { branding }) => {
        localStorage.setItem("branding", JSON.stringify(branding));
        return { ...state, branding, isLoading: false }
    }),
    on(brandingLoad, (state, { branding }) => {
        localStorage.setItem("branding", JSON.stringify(branding));
        return { ...state, branding, isLoading: false }
    }),
);
