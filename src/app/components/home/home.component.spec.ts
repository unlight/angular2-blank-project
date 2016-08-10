import { describe, expect, inject, async, beforeEachProviders } from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {HomeComponent} from './home.component';
import {NameListService} from '../../services/name-list.service';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
// import {disableDeprecatedForms, provideForms} from '@angular/forms';

describe('Home component', () => {

    // beforeEachProviders(() => [
    //     disableDeprecatedForms(),
    //     provideForms(),
    // ]);

    // TODO: It looks like you're using the old forms module
    it('should work', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent).then(rootTC => {
            rootTC.detectChanges();

            let homeInstance = rootTC.debugElement.children[0].componentInstance;
            let homeDOMEl = rootTC.debugElement.children[0].nativeElement;
            let nameListLen = function () {
                return homeInstance.nameListService.names.length;
            };
            expect(homeInstance.nameListService).toEqual(jasmine.any(NameListService));
            expect(nameListLen()).toEqual(4);
            expect(getDOM().querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
            // But we do not need it.
            expect(homeDOMEl.querySelectorAll('li').length).toEqual(nameListLen());

            homeInstance.newName = 'Minko';
            homeInstance.addName();
            rootTC.detectChanges();

            expect(nameListLen()).toEqual(5);
            expect(getDOM().querySelectorAll(homeDOMEl, 'li').length).toEqual(nameListLen());
            expect(getDOM().querySelectorAll(homeDOMEl, 'li')[4].textContent).toEqual('Minko');
        });
    })));
});

@Component({
    providers: [NameListService],
    selector: 'test-cmp',
    template: '<sd-home></sd-home>',
    directives: [HomeComponent]
})
class TestComponent { }
