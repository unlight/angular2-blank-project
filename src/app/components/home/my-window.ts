import { Component, ViewChild } from '@angular/core';
import { WindowViewContainerComponent } from '../../modal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'sd-my-window',
    template: `
  <window-view-container [heading]="windowTitle">
    It's a window!!
    <a href="javascript:" (click)="close()">close x</a>
  </window-view-container>`
})
export class MyWindowComponent {

    windowTitle: string = 'Title here!';

    @ViewChild(WindowViewContainerComponent)
    windowViewContainer: WindowViewContainerComponent;

    ngOnInit() {
        this.windowViewContainer.close.subscribe(target => console.log('closed', target))
    }

    close() {
        this.windowViewContainer.closeWindow();
    }
}
