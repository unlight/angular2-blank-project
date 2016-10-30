import {AppModule} from './app.module';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

// @if isProd
enableProdMode();
// @endif

platformBrowserDynamic().bootstrapModule(AppModule);
