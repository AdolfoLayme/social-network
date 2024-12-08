import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class EditarPerfilGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();

      // Verifica si el usuario está autenticado
      if (usuarioActual?.uid) {
        return true; // Permite el acceso si el usuario está autenticado
      }

      // Si no está autenticado, redirige al inicio
      this.router.navigate(['/']);
      return false;
    } catch (error) {
      console.error('Error en EditarPerfilGuard:', error);
      this.router.navigate(['/']);
      return false; // Redirige al inicio en caso de error
    }
  }
}
