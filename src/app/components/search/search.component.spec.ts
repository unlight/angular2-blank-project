// import {TestBed} from '@angular/core/testing';
// import {Mock} from '../../services/mocks/mocks.spec';
// import {MockLocationStrategy} from '@angular/common/testing';
// import {LocationStrategy} from '@angular/common';
// import {RouterOutletMap} from '@angular/router';
// import {ActivatedRoute} from '@angular/router';
// import {Router} from '@angular/router';
// // import { MockRouteSegment } from '../../services/mocks/routes';
// import {MockSearchService} from '../../services/mocks/search.service';
// import {SearchComponent} from './search.component';

// describe('Search component', () => {

//     var mockSearchService: MockSearchService;

//     beforeEach(() => TestBed.configureTestingModule({
//         providers: [
//             mockSearchService.getProviders(),
//             { provide: ActivatedRoute, useClass: Mock },
//             { provide: Router, useClass: Mock },
//             { provide: RouterOutletMap, useClass: RouterOutletMap },
//             { provide: LocationStrategy, useClass: MockLocationStrategy },
//             // {provide: RouteSegment, useValue: new MockRouteSegment({ 'term': 'peyton' }) }
//         ]
//     }));

//     xit('should search when a term is set and search() is called', () => { // eslint-disable-line jasmine/no-disabled-tests
//         const fixture = TestBed.createComponent(SearchComponent);
//         let searchComponent = fixture.debugElement.componentInstance;
//         searchComponent.query = 'M';
//         searchComponent.search();
//         expect(mockSearchService.searchSpy).toHaveBeenCalledWith('M');
//     });

//     xit('should search automatically when a term is on the URL', () => { // eslint-disable-line jasmine/no-disabled-tests
//         const fixture = TestBed.createComponent(SearchComponent);
//         fixture.detectChanges();
//         expect(mockSearchService.searchSpy).toHaveBeenCalledWith('peyton');
//     });
// });
