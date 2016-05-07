import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Person} from '../../services/search.service';
import {SearchService} from 'services';

@Component({
    selector: 'sd-search',
    templateUrl: './search.component.html',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class SearchComponent {

    loading: boolean;
    query: string;
    searchResults: Array<Person>;

    constructor(public searchService: SearchService, params: RouteParams) {
        if (params.get('term')) {
            this.query = decodeURIComponent(params.get('term'));
            this.search();
        }
    }

    search(): void {
        this.searchService.search(this.query).subscribe(
            data => { this.searchResults = data; },
            error => console.log(error)
        );
    }
}
