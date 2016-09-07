import {LocationStrategy} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {MockLocationStrategy} from '@angular/common/testing';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {NavbarComponent} from './navbar/navbar.component';

class TestComponent { }

describe('App component', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                ToolbarComponent,
                NavbarComponent,
                TestComponent
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [
                { provide: LocationStrategy, useClass: MockLocationStrategy }
            ]
        });
    });

    it('should build without a problem', async(() => {

        TestBed.overrideComponent(TestComponent, {
            set: {
                template: '<sd-app></sd-app>'
            }
        });

        TestBed.compileComponents().then(() => {
            var fixture: ComponentFixture<any> = TestBed.createComponent(TestComponent);
            expect(fixture).toBeTruthy();
            var div = fixture.nativeElement as HTMLDivElement;
            expect(div.innerHTML.indexOf('HOME')).toBeTruthy();
        });
    }));

});