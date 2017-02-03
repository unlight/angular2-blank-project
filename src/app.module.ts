import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var FuseBox;

import { StoreModule } from '@ngrx/store';
import { counterReducer } from './reducers';

const routes: Routes = [
    {
        path: 'about', loadChildren: () => {
            return new Promise((resolve, reject) => {
                FuseBox.import('./about.module.js', ({FuseBox}) => {
                    const { AboutModule } = FuseBox.import('./about.module');
                    resolve(AboutModule);
                });
            });
        }
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        StoreModule.provideStore({ counter: counterReducer }),
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ]
})
export class AppModule { }


