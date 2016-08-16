import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

// TODO: Made static offline compiler
// @if isProd
enableProdMode();
// The browser platform without a compiler
// import { platformBrowser } from '@angular/platform-browser';
// The app module factory produced by the static offline compiler
// import { AppModuleNgFactory } from './app.module.ngfactory';
// Launch with the app module factory.
// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
// @endif
