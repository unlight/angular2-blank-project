import "es6-shim";
import "reflect-metadata";
import "zone.js/dist/zone";
import "./app.css";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

// @if !DEV_MODE
enableProdMode();
// @endif

platformBrowserDynamic().bootstrapModule(AppModule);
