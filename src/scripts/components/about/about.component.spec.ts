import {
    TestComponentBuilder,
    describe,
    xdescribe,
    expect,
    injectAsync,
    fit,
    it
} from 'angular2/testing';
import {Component} from 'angular2/core';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {AboutComponent} from './about.component';

xdescribe('About component', () => {
    it('should work',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((rootTC) => {
                    let aboutDOMEl = rootTC.debugElement.children[0].nativeElement;

                    expect(DOM.querySelectorAll(aboutDOMEl, 'h2')[0].textContent).toEqual('Features');
                });
        }));
});

@Component({
    selector: 'test-cmp',
    directives: [AboutComponent],
    template: '<sd-about></sd-about>'
})
class TestComponent { }
