import {Directive, ElementRef} from '@angular/core';

/**
 * Basic directive sample.
 * For more info see official docs:
 * https://angular.io/docs/ts/latest/api/core/Directive-var.html
 */
@Directive({
    selector: '[sdLoglement]' // using [ ] means selecting attributes
})
export class LogElementDirective {
    constructor(element: ElementRef) {
        console.log('directive [sd-logElement]', element);
    }
}
