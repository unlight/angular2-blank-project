// See examples https://yujuiting.github.io/ng2-window-view/
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {WindowViewService} from './core/window-view.service';
import {WindowViewLayerService} from './core/window-view-layer.service';
import {WindowViewOutletComponent} from './core/window-view-outlet.component';
import {WindowViewContainerComponent} from './core/window-view-container.component';

@NgModule({
    exports: [
        WindowViewOutletComponent,
        WindowViewContainerComponent
    ],
    imports: [
        BrowserModule
    ],
    declarations: [
        WindowViewContainerComponent,
        WindowViewOutletComponent,
    ],
    providers: [
        WindowViewService,
        WindowViewLayerService,
    ],
    entryComponents: []
})
export class ModalModule { }
