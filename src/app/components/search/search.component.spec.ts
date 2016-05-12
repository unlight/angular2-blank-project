import {it,describe, expect, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {xit} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {RouteSegment} from '@angular/router';
import {provide} from '@angular/core';
import {MockRouterProvider, MockRouteSegment} from '../../services/mocks/routes';
import {MockSearchService} from '../../services/mocks/search.service';
import {SearchComponent} from './search.component';

describe('Search component', () => {
    var mockSearchService: MockSearchService;
    var mockRouterProvider: MockRouterProvider;

    beforeEachProviders(() => {
        mockSearchService = new MockSearchService();
        mockRouterProvider = new MockRouterProvider();

        return [
            mockSearchService.getProviders(),
            mockRouterProvider.getProviders(),
            provide(RouteSegment, { useClass: MockRouteSegment }),
        ];
    });

    it('should search when a term is set and search() is called', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(SearchComponent).then((fixture) => {
            let searchComponent = fixture.debugElement.componentInstance;
            searchComponent.query = 'M';
            searchComponent.search();
            expect(mockSearchService.searchSpy).toHaveBeenCalledWith('M');
        });
    }));

    xit('should search automatically when a term is on the URL', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        mockRouterProvider.setRouteParam('term', 'peyton');
        return tcb.createAsync(SearchComponent).then((fixture) => {
            fixture.detectChanges();
            expect(mockSearchService.searchSpy).toHaveBeenCalledWith('peyton');
        });
    }));
});