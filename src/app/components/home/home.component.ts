import {Component} from '@angular/core';
import {NameListService} from '../../services/name-list.service';
import { MyWindowComponent } from './my-window';
import {WindowViewService} from '../../modal';

@Component({
    selector: 'sd-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

    title: string = 'Welcome';
    newName: string;
    constructor(
        private windowView: WindowViewService,
        public nameListService: NameListService) { }

    /*
     * @param newname  any text as input.
     * @returns return false to prevent default form submit behavior to refresh the page.
     */
    addName(): boolean {
        this.nameListService.add(this.newName);
        this.newName = '';
        return false;
    }

  openWindow() {
    this.windowView.pushWindow(MyWindowComponent).then(componentRef => {
        (componentRef.instance);
    })
  }
}
