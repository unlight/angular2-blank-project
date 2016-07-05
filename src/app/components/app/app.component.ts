import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, provideRouter, RouterConfig} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {HomeComponent} from '../../components/home/home.component';
import {AboutComponent} from '../../components/about/about.component';
import {SearchComponent} from '../../components/search/search.component';
import {NameListService} from '../../services/name-list.service';
import {SearchService} from '../../services/search.service';


const routes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'search', component: SearchComponent }
];

@Component({
    selector: 'sd-app',
    viewProviders: [NameListService, SearchService],
    templateUrl: './app.component.html',
    providers: [provideRouter(routes)],
    directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
export class AppComponent { }


