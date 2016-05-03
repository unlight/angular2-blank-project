import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {NavbarComponent} from './navbar.component';
import {ToolbarComponent} from './toolbar.component';
import {HomeComponent} from '../../components/home/home.component';
import {AboutComponent} from '../../components/about/about.component';
import {SearchComponent} from '../../components/search/search.component';
import {EditComponent} from '../../components/search/edit.component';
import {NameListService} from '../../services/name-list.service';
import {SearchService} from '../../services/search.service';

@Component({
    selector: 'sd-app',
    viewProviders: [NameListService, SearchService],
    templateUrl: './app.component.html',
    directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@Routes([
    { path: '/', component: HomeComponent },
    { path: '/about', component: AboutComponent },
    { path: '/search', component: SearchComponent },
    { path: '/edit/:id', component: EditComponent }
])
export class AppComponent { }
