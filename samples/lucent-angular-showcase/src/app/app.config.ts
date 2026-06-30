import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

/**
 * Zoneless — the Lucent kit is signals + OnPush throughout, so no zone.js.
 * CDK overlays (menu/modal/select/tooltip) work without the animations package.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
  ],
};
