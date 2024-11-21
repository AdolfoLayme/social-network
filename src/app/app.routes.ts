import { Routes } from '@angular/router';
import { HomeComponent } from './funcionalidades/home/home.component';


export const routes: Routes = [
  {
    path: '', redirectTo: 'home', // Redirige automáticamente a la página principal
    pathMatch: 'full',
  },
  {
    path: 'home', loadComponent: () =>import('./funcionalidades/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'registro', loadComponent: () => import('./funcionalidades/autenticacion/registro/registro.component').then((m) => m.RegistroComponent),
  },
];
