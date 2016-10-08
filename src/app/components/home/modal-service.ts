import tinyModal = require('tiny-modal');
import {Directive, ElementRef, OnInit, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[tm]'
})
export class TestModalDirective implements OnInit {

    constructor(private _elementRef: ElementRef) {

    }

    @Input('tm')
    tm;

    @HostListener('click', ['$event'])
    open(e) {
        var div = document.createElement('div');
        div.innerHTML = '<div style="">Modal</div>';
        document.body.appendChild(div);
        var el = this._elementRef.nativeElement;
        var modal = tinyModal(div);
        modal.show();
    }

    ngOnInit() {
    }
}

