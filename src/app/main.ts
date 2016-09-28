import {enableProdMode} from '@angular/core';
import {AppModule} from './app.module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

// @if isProd
enableProdMode();
// @endif

platformBrowserDynamic().bootstrapModule(AppModule);
