import { Routes } from '@angular/router';
import { About } from './views/about/about';
import { Projects } from './views/projects/projects';
import { WorldMap } from "./views/world-map/world-map";
import { Portfolio } from './views/portfolio/portfolio';


export const routes: Routes = [
    { path: 'about', component: About },
    { path: 'portfolio', component: Portfolio},
    { path: 'projects', component: Projects },
    { path: 'world-map', component: WorldMap },
    { path: '**', redirectTo: 'about', pathMatch: 'full'}
];