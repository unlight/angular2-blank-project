import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES, RouteSegment} from '@angular/router';
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

    constructor(public searchService: SearchService, routeSegment: RouteSegment) {
        // TODO: term
        if (routeSegment.getParam('term')) {
            this.query = decodeURIComponent(routeSegment.getParam('term'));
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
