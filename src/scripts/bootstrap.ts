import {provide, enableProdMode} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppComponent} from './components/app/app.component';

// @if isProd
enableProdMode();
// @endif

bootstrap(AppComponent, [
    HTTP_PROVIDERS, ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, { useValue: '/* @echo APP_BASE */' })
]);

// In order to start the Service Worker located at "./sw.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful with scope: ',    registration.scope);
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed: ', err);
//   });
// } 

// Hot loading is temporary disabled
//
// import {provide} from '@angular/core';
// import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from '@angular/router';
// import {AppCmp} from './app/components/app';

// System.import('//localhost:<%= HOT_LOADER_PORT %>/ng2-hot-loader')
//   .then(loader => {
//     loader.ng2HotLoaderBootstrap(AppCmp, [
//       ROUTER_PROVIDERS,
//       provide(LocationStrategy, { useClass: HashLocationStrategy })
//     ]);
//   });
