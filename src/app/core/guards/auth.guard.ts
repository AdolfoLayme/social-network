import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';

export const authGuard: CanActivateFn = async () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  const usuarioActual = await usuarioService.getUsuarioActual();

  if (usuarioActual) {
    return true;
  } else {
    router.navigate(['/registro']);
    return false;
  }
};
