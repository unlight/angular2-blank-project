import {Routes, RouterModule} from '@angular/router';
import {provideRouter, RouterConfig} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {SearchComponent} from './components/search/search.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'search', component: SearchComponent },
    { path: 'edit/:id', component: EditComponent },
    // { path: '**', component: PageNotFoundComponent }
];

export const routeProviders = [
    // provideRouter(routes)
];

export const routing = RouterModule.forRoot(routes);
