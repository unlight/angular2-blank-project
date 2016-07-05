import {Component} from '@angular/core';
import {NameListService} from '../../services/name-list.service';

@Component({
    selector: 'sd-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    newName: string;
    constructor(public nameListService: NameListService) { }

    /*
     * @param newname  any text as input.
     * @returns return false to prevent default form submit behavior to refresh the page.
     */
    addName(): boolean {
        this.nameListService.add(this.newName);
        this.newName = '';
        return false;
    }
}
