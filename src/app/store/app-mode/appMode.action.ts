import { createAction, props } from '@ngrx/store';
import { AppMode } from './appMode.reducer';

export const modeChange = createAction('[App] Mode Change', props<{ mode: AppMode }>());
export const modeChangeSuccess = createAction('[App] Mode Change Success', props<{ mode: AppMode }>());
