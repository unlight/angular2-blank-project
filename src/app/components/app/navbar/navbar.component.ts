import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
  directives: [ROUTER_DIRECTIVES],
  selector: 'sd-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {}
