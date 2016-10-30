import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {SearchComponent} from './components/search/search.component';
import {EditComponent} from './components/edit/edit.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'search', component: SearchComponent },
    { path: 'edit/:id', component: EditComponent },
    // { path: '**', component: PageNotFoundComponent }
];

export const routeProviders = [
    // provideRouter(routes)
];
