import { Component } from '@angular/core';
import { WindowViewContainerComponent } from 'ng2-window-view';

@Component({
  selector: 'my-window',
  template: `
  <window-view-container [heading]="windowTitle">
    It's a window!!
  </window-view-container>`
})
export class MyWindowComponent {
  windowTitle: string = 'Title here!';
}
