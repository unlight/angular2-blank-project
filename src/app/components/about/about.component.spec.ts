import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {AboutComponent} from './about.component';

describe('About component', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                AboutComponent
            ],
            imports: [
            ],
            providers: [
            ]
        });
    });

    it('should work', async(() => {

        TestBed.overrideComponent(TestComponent, {
            set: {
                template: '<sd-about></sd-about>'
            }
        });

        TestBed.compileComponents().then(() => {
            var fixture = TestBed.createComponent(TestComponent);
            let aboutDOMEl = fixture.debugElement.children[0].nativeElement;
            var [h2] = aboutDOMEl.querySelectorAll('h2');
            expect(h2.textContent).toEqual('Features');
        });
    }));

});

@Component({
    selector: 'sd-test-cmp',
    template: '<sd-about></sd-about>'
})
class TestComponent { }
