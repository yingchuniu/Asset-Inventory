import { Routes } from '@angular/router';
import { Assets } from './pages/assets/assets';

export const routes: Routes = [
    {path:"",redirectTo:"assets",pathMatch:"full"},
    {path:"assets",component:Assets}
];
