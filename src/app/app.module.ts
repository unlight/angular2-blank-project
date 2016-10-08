import {EditComponent} from './components/edit/edit.component';
import {HttpModule} from '@angular/http';
import {NavbarComponent} from './components/app/navbar/navbar.component';
import {ToolbarComponent} from './components/app/toolbar/toolbar.component';
import {SearchComponent} from './components/search/search.component';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {HashLocationStrategy} from '@angular/common';
import {LocationStrategy} from '@angular/common';
import {APP_BASE_HREF} from '@angular/common';
import {SearchService} from './services/search.service';
import {NameListService} from './services/name-list.service';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppComponent} from './components/app/app.component';
import {routes} from './app.routes';
import {ModalModule} from './modal';
import {MyWindowComponent} from './components/home/my-window';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        HttpModule,
        ModalModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        AboutComponent,
        ToolbarComponent,
        SearchComponent,
        EditComponent,
        MyWindowComponent,
    ],
    providers: [
        NameListService,
        SearchService,
        { provide: APP_BASE_HREF, useValue: '/* @echo APP_BASE */' },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],
    entryComponents: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
