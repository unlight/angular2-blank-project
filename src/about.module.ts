import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { RouterModule } from '@angular/router';

const routes = [
    { path: '', component: AboutComponent }
];

@NgModule({
    declarations: [
        AboutComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    bootstrap: [AboutComponent]
})
export class AboutModule { }
