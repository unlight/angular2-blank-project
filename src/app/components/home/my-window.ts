import { Component } from '@angular/core';

@Component({
    selector: 'sd-my-window',
    template: `
  <window-view-container [heading]="windowTitle">
    It's a window!!
  </window-view-container>`
})
export class MyWindowComponent {
    windowTitle: string = 'Title here!';
}
