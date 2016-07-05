import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Person, SearchService} from '../../services/search.service';
import 'rxjs/operator/do';

@Component({
    selector: 'sd-search',
    templateUrl: './search.component.html',
    directives: [ROUTER_DIRECTIVES]
})
export class SearchComponent {

    loading: boolean;
    query: string;
    searchResults: Array<Person>;

    constructor(public searchService: SearchService, r: ActivatedRoute ) {
        const term: Observable<string> = r.params.map(p => p['term'])
            .map(p => decodeURIComponent(p));
        // TODO: Can be merged with search()
        term.subscribe(t => {
            this.query = t;
            this.search();
        });
    }

    search(): void {
        this.searchService.search(this.query).subscribe(
            data => { this.searchResults = data; },
            error => console.log(error)  // eslint-disable-line
        );
    }
}
