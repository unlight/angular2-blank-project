import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.scss')],
})
export class AppComponent {
    name = 'Angular';
}
