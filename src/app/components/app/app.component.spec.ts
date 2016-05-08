import {describe, expect, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {it} from '@angular/core/testing';
// import {xit} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component, provide} from '@angular/core';
import {Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from '@angular/router-deprecated';
import {Location} from '@angular/common';
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
// import {getDOM} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {DirectiveResolver} from '@angular/compiler';

declare var getDOM: any;

export function main() {

  describe('App component', () => {

    // Support for testing component that uses Router
    beforeEachProviders(() => [
      RouteRegistry,
      DirectiveResolver,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(Router, {useClass: RootRouter})
    ]);

    it('should work',
      injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(TestComponent)
          .then(rootTC => {
            rootTC.detectChanges();
            let appDOMEl = rootTC.debugElement.children[0].nativeElement;
            expect(getDOM().querySelectorAll(appDOMEl, 'sd-app > sd-navbar > nav > a')[1].href).toMatch(/http:\/\/localhost:\d+\/about/);
          });
      }));
  });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-app></sd-app>',
  directives: [AppComponent]
})
class TestComponent {}
