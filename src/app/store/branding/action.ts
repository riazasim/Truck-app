import { createAction, props } from '@ngrx/store';
import { Branding } from './reducer';

export const brandingLoad = createAction('[Branding] Branding Load', props<{ branding: Branding }>());
export const brandingChange = createAction('[Branding] Branding Change', props<{ branding: Branding }>());
export const brandingChangeSuccess = createAction('[Branding] Branding Change Success', props<{ branding: Branding }>());
