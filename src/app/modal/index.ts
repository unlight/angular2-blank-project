import {NgModule} from '@angular/core';

import {WindowViewService} from './core/window-view.service';
import {WindowViewLayerService} from './core/window-view-layer.service';
import {WindowViewOutletComponent} from './core/window-view-outlet.component';
import {WindowViewContainerComponent} from './core/window-view-container.component';

export {WindowViewService};

@NgModule({
    exports: [
    ],
    imports: [
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
