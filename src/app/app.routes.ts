import { Routes } from '@angular/router';
import { HomeComponent } from './funcionalidades/home/home.component';
import { FeedComponent } from './funcionalidades/feed/feed/feed.component';
import { VerPerfilComponent } from './funcionalidades/perfil/ver-perfil/ver-perfil.component';
import { GruposComponent } from './funcionalidades/feed/grupos/grupos.component';
import { NotificacionesComponent } from './funcionalidades/feed/notificaciones/notificaciones.component';


export const routes: Routes = [
 // Ruta principal redirigida a 'home'
 {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
},
{
  path: 'home',
  loadComponent: () =>
    import('./funcionalidades/home/home.component').then(
      (m) => m.HomeComponent
    ),
},
{
  path: 'registro',
  loadComponent: () =>
    import('./funcionalidades/autenticacion/registro/registro.component').then(
      (m) => m.RegistroComponent
    ),
},
{
  path: 'configurar-perfil',
  loadComponent: () =>
    import(
      './funcionalidades/perfil/configurar-perfil/configurar-perfil.component'
    ).then((m) => m.ConfigurarPerfilComponent),
},

// Rutas principales para feed y sus hijos
{
  path: 'feed',
  component: FeedComponent, 
  children: [
    {
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full',
    },
    {
      path: 'inicio',
      loadComponent: () =>
        import('./funcionalidades/feed/publicaciones/publicaciones.component').then(
          (m) => m.PublicacionesComponent
        ),
    },
    {
      path: 'perfil',
      component: VerPerfilComponent, 
    },
    {
      path: 'grupos',
      component:GruposComponent,
    },
    {
      path: 'notificaciones',
      component:NotificacionesComponent,
    }
  ],
},
];
