import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurarPerfilGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();

      if (usuarioActual?.uid) {
        const perfilCompletado = await this.usuarioService.esPerfilCompletado(usuarioActual.uid);

        if (perfilCompletado) {
          this.router.navigate(['/feed']);
          return false; 
        }
      }

      return true; 
    } catch (error) {
      console.error('Error en ConfigurarPerfilGuard:', error);
      return false; 
    }
  }
}
