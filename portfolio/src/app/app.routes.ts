import { Routes } from '@angular/router';
import { WorldMap } from './views/world-map/world-map';
import { WashingtonEmployment } from './views/washington-employment/washington-employment';

export const routes: Routes = [
    { path: 'washington-employment', component: WashingtonEmployment },
    { path: 'world-map', component: WorldMap },
    { path: '**', redirectTo: 'world-map', pathMatch: 'full'}
];