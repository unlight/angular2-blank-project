import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';
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
  moduleId: module.id,
  templateUrl: './app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
@RouteConfig([
  { path: '/',      name: 'Home',  component: HomeComponent  },
  { path: '/about', name: 'About', component: AboutComponent },
  { path: '/search', name: 'Search', component: SearchComponent },
  { path: '/edit/:id', name: 'Edit', component: EditComponent }
])
export class AppComponent {}
