import { createReducer, on } from '@ngrx/store';
import { modeChange, modeChangeSuccess } from './appMode.action';

export interface AppMode {
    id: string;
    name: string;
    description: string | null;
    transportModeDefaultLogo: {
        fullpath: string;
    }
}

export interface AppModeState {
    mode: AppMode | null;
    isLoading: boolean;
}

export const initialState: AppModeState = {
    mode: {
        "id": "3",
        "name": "WATER",
        "description": null,
        "transportModeDefaultLogo": {
            "fullpath": "https:\/\/transport.lares.ro\/uploads\/logos1726032170-transportModeLogo-66e1292a229bd.jpg"
        }
    },
    isLoading: false
};

export const appModeReducer = createReducer(
    initialState,
    on(modeChange, (state) => ({ ...state, isLoading: true })),
    on(modeChangeSuccess, (state, { mode }) => ({ ...state, mode: { ...mode, id: String(mode?.id) }, isLoading: false })),
);
