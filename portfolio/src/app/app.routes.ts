import { Routes } from '@angular/router';
import { WorldMap } from './views/world-map/world-map';
import { WashingtonEmployment } from './views/washington-employment/washington-employment';
import { About } from './views/about/about';
import { Projects } from './views/projects/projects';
import { ParametricSvgGenerator } from './views/parametric-svg-generator/parametric-svg-generator';


export const routes: Routes = [
    { path: 'about', component: About },
    { path: 'projects', component: Projects },
    { path: 'parametric-svg-generator', component: ParametricSvgGenerator },
    { path: 'washington-employment', component: WashingtonEmployment },
    { path: 'world-map', component: WorldMap },
    { path: '**', redirectTo: 'about', pathMatch: 'full'}
];