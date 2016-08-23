import {Mock} from '../../mocks.spec';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router, RouterOutletMap} from '@angular/router';
import {TestComponentBuilder} from '@angular/core/testing';
import {Component} from '@angular/core';
import { async, addProviders, inject } from '@angular/core/testing';
import {AppComponent} from './app.component';
import {MockLocationStrategy} from '@angular/common/testing';

describe('App component', () => {

    beforeEach(() => addProviders([
        { provide: ActivatedRoute, useClass: Mock },
        { provide: Router, useClass: Mock },
        { provide: RouterOutletMap, useClass: RouterOutletMap },
        { provide: LocationStrategy, useClass: MockLocationStrategy }
    ]));

    it('should build without a problem', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
            .then(fixture => {
                expect(fixture.nativeElement.innerText.indexOf('HOME')).toBeTruthy();
            })
            .catch(err => fail(err));
    })));

});

@Component({
    selector: 'test-cmp',
    template: '<sd-app></sd-app>',
    directives: [AppComponent]
})
class TestComponent { }
