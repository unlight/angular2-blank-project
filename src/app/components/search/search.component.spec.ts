import {MockLocationStrategy} from '@angular/testing/src/mock/mock_location_strategy';
import {LocationStrategy} from '@angular/common/src/location/location_strategy';
import {RouterOutletMap} from '@angular/router/src/router_outlet_map';
import {Mock} from '../../mocks/mocks.spec';
import {ActivatedRoute} from '@angular/router/src/router_state';
import { provide } from '@angular/core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {xit, describe, expect, beforeEachProviders, inject} from '@angular/core/testing';
import { Router} from '@angular/router';
// import { MockRouteSegment } from '../../services/mocks/routes';
import {MockSearchService} from '../../services/mocks/search.service';
import { SearchComponent } from './search.component';

describe('Search component', () => {

    beforeEachProviders(() => [
        { provide: ActivatedRoute, useClass: Mock },
        { provide: Router, useClass: Mock },
        { provide: RouterOutletMap, useClass: RouterOutletMap },
        { provide: LocationStrategy, useClass: MockLocationStrategy }
    ]);

    var mockSearchService: MockSearchService;

    beforeEachProviders(() => {
        mockSearchService = new MockSearchService();
        return [
            mockSearchService.getProviders(),
            // provide(RouteSegment, { useValue: new MockRouteSegment({ 'term': 'peyton' }) })
        ];
    });

    xit('should search when a term is set and search() is called', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(SearchComponent)
            .then(fixture => {
                console.log("fixture ", fixture);
                let searchComponent = fixture.debugElement.componentInstance;
                searchComponent.query = 'M';
                searchComponent.search();
                expect(mockSearchService.searchSpy).toHaveBeenCalledWith('M');
            })
            .catch(err => fail(err));
    }));

    xit('should search automatically when a term is on the URL', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(SearchComponent)
            .then(fixture => {
                fixture.detectChanges();
                expect(mockSearchService.searchSpy).toHaveBeenCalledWith('peyton');
            })
            .catch(err => fail(err));
    }));
});
