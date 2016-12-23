import "reflect-metadata";
import "zone.js/dist/zone";
// import "./less/styles.less";
import "./app.css";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

// TODO: gulp-context
// enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
