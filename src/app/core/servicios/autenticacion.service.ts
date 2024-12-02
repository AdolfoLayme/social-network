import { Injectable } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(private auth: Auth) {}

  // Recuperar contraseña
  recuperarContrasena(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

}
