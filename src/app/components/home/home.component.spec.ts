import {
    describe,
    xdescribe,
    expect,
    injectAsync,
    it
} from '@angular/core/testing';
import TestComponentBuilder from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {HomeComponent} from './home.component';
import {NameListService} from '../../services/name-list.service';

describe('Home component', () => {
    it('should work',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then(rootTC => {
                    rootTC.detectChanges();

                    let homeInstance = rootTC.debugElement.children[0].componentInstance;
                    let homeDOMEl = rootTC.debugElement.children[0].nativeElement;
                    let nameListLen = function() {
                        return homeInstance.nameListService.names.length;
                    };

                    expect(homeInstance.nameListService).toEqual(jasmine.any(NameListService));
                    expect(nameListLen()).toEqual(4);
                    // BUG: DOM is null https://github.com/angular/angular/issues/6904
                    // expect(DOM.querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
                    // But we do not need it.
                    expect(homeDOMEl.querySelectorAll('li').length).toEqual(nameListLen());

                    homeInstance.newName = 'Minko';
                    homeInstance.addName();
                    rootTC.detectChanges();

                    expect(nameListLen()).toEqual(5);
                    // BUG: DOM is null https://github.com/angular/angular/issues/6904
                    // expect(DOM.querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
                    // expect(DOM.querySelectorAll(homeDOMEl, 'li')[4].textContent).toEqual('Minko');
                });
        }));
});

@Component({
    providers: [NameListService],
    selector: 'test-cmp',
    template: '<sd-home></sd-home>',
    directives: [HomeComponent]
})
class TestComponent { }
