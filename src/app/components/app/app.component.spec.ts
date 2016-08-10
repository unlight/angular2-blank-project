import {LocationStrategy, PathLocationStrategy, HashLocationStrategy} from '@angular/common';
import { Router, ActivatedRoute, RouterOutletMap } from '@angular/router';
import {Mock} from '../../mocks/mocks.spec';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { async, addProviders, beforeEachProviders, describe, expect, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MockLocationStrategy} from "@angular/testing";


describe('App component', () => {

    beforeEachProviders(() => [
        { provide: ActivatedRoute, useClass: Mock },
        { provide: Router, useClass: Mock },
        { provide: RouterOutletMap, useClass: RouterOutletMap },
        { provide: LocationStrategy, useClass: MockLocationStrategy }
    ]);

    // beforeEach(() => addProviders([
    //     { provide: ActivatedRoute, useClass: Mock },
    //     { provide: Router, useClass: Mock },
    //     { provide: RouterOutletMap, useClass: RouterOutletMap },
    //     { provide: LocationStrategy, useClass: MockLocationStrategy }
    // ]));

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
