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
import {AboutComponent} from './about.component';

describe('About component', () => {
    
    it('should work',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestComponent)
                .then((rootTC) => {
                    let aboutDOMEl = rootTC.debugElement.children[0].nativeElement;
                    var [h2] = aboutDOMEl.querySelectorAll('h2');
                    expect(h2.textContent).toEqual('Features');
                });
        }));
});

@Component({
    selector: 'test-cmp',
    directives: [AboutComponent],
    template: '<sd-about></sd-about>'
})
class TestComponent { }
