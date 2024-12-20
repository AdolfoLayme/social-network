import { Routes } from '@angular/router';
import { RecuperarClaveComponent } from './funcionalidades/autenticacion/recuperar-clave/recuperar-clave.component';
import { ConfigurarPerfilGuard } from './core/guards/configurar-perfil.guard';
import { EditarPerfilGuard } from './core/guards/editar-perfil.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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
    path: 'recuperar-clave',
    component: RecuperarClaveComponent,
  },
  {
    path: 'configurar-perfil',
    loadComponent: () =>
      import(
        './funcionalidades/perfil/configurar-perfil/configurar-perfil.component'
      ).then((m) => m.ConfigurarPerfilComponent),
    canActivate: [ConfigurarPerfilGuard, authGuard],
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./funcionalidades/feed/feed/feed.component').then(
        (m) => m.FeedComponent
      ),
    canActivate: [authGuard], 
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import(
            './funcionalidades/feed/publicaciones/publicaciones.component'
          ).then((m) => m.PublicacionesComponent),
        canActivate: [authGuard],
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import(
            './funcionalidades/perfil/ver-perfil/ver-perfil.component'
          ).then((m) => m.VerPerfilComponent),
        canActivate: [authGuard],
        children: [
          {
            path: 'editar',
            loadComponent: () =>
              import(
                './funcionalidades/perfil/editar-perfil/editar-perfil.component'
              ).then((m) => m.EditarPerfilComponent),
            canActivate: [EditarPerfilGuard, authGuard], 
          },
        ],
      },
      {
        path: 'perfil/:uid', 
        loadComponent: () =>
          import('./funcionalidades/perfil/ver-perfil/ver-perfil.component').then(
            (m) => m.VerPerfilComponent
          ),
        canActivate: [authGuard],
      },  
      {
        path: 'grupos',
        loadComponent: () =>
          import('./funcionalidades/feed/grupos/grupos.component').then(
            (m) => m.GruposComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import(
            './funcionalidades/feed/notificaciones/notificaciones.component'
          ).then((m) => m.NotificacionesComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
