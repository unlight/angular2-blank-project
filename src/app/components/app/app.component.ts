import { Router } from '@angular/router';
import { provide } from '@angular/core';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, provideRouter, RouterConfig} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {NameListService} from '../../services/name-list.service';
import {SearchService} from '../../services/search.service';

@Component({
    selector: 'sd-app',
    templateUrl: './app.component.html',
    providers: [
        NameListService,
        SearchService,
    ],
    directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent]
})
export class AppComponent {
}
