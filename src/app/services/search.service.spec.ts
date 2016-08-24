import { inject, fakeAsync, tick, addProviders } from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {provide} from '@angular/core';
import 'rxjs/add/operator/map';
import {Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import {SearchService} from './search.service';

describe('Search Service', () => {
    beforeEach(() => {
        addProviders([BaseRequestOptions, MockBackend, SearchService,
            provide(Http, {
                useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                }, deps: [MockBackend, BaseRequestOptions]
            }),
        ]);
    });

    // Should be skipped really, because we do not use http request.
    xit('should retrieve all search results', // eslint-disable-line jasmine/no-disabled-tests
        inject([SearchService, MockBackend], fakeAsync((searchService: SearchService, backend: MockBackend) => {
            var res: Response;
            backend.connections.subscribe(c => {
                expect(c.request.url).toBe('http://example.com/people.json');
                let response = new ResponseOptions({ body: '[{"name": "John Elway"}, {"name": "Gary Kubiak"}]' });
                c.mockRespond(new Response(response));
            });
            searchService.getAll().subscribe((response) => {
                res = response;
            });
            tick();
            expect(res[0].name).toBe('John Elway');
        }))
    );

    // Should be skipped really, because we do not use http request.
    xit('should filter by search term', // eslint-disable-line jasmine/no-disabled-tests
        inject([SearchService, MockBackend], fakeAsync((searchService: SearchService, mockBackend: MockBackend) => {
            var res: Array<any>;
            mockBackend.connections.subscribe(c => {
                expect(c.request.url).toBe('data/people.json');
                let response = new ResponseOptions({ body: '[{"name": "John Elway"}, {"name": "Gary Kubiak"}]' });
                c.mockRespond(new Response(response));
            });
            searchService.search('john').subscribe((response) => {
                res = response;
            });
            tick();
            expect(res[0].name).toBe('John Elway');
        }))
    );

    // Should be skipped really, because we do not use http request.
    xit('should fetch by id', // eslint-disable-line jasmine/no-disabled-tests
        inject([SearchService, MockBackend], fakeAsync((searchService: SearchService, mockBackend: MockBackend) => {
            var res: Array<any>;
            mockBackend.connections.subscribe(c => {
                expect(c.request.url).toBe('data/people.json');
                let response = new ResponseOptions({ body: '[{"id": 1, "name": "John Elway"}, {"id": 2, "name": "Gary Kubiak"}]' });
                c.mockRespond(new Response(response));
            });
            searchService.search('2').subscribe((response) => {
                res = response;
            });
            tick();
            expect(res[0].name).toBe('Gary Kubiak');
        }))
    );
});


