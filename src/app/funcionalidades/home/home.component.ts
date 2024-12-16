import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../core/servicios/usuario.service';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../core/servicios/autenticacion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';
  correoInvalido: boolean = false;
  cargando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AutenticacionService
  ) { }

  iniciarSesionGoogle() {
    this.cargando = true;
    this.authService.loginConGoogle()
      .then((user) => {
        console.log('Usuario autenticado:', user);
        this.router.navigate(['/configurar-perfil']);
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
        this.mensajeError = 'Error al iniciar sesión con Google.';
      })
      .finally(() => {
        this.cargando = false;
      });
  }

  validarCorreoInstitucional(): void {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@unajma\.edu\.pe$/;
    this.correoInvalido = !correoRegex.test(this.email);
  }


  async onLogin() {
    this.mensajeError = '';

    if (this.correoInvalido) {
      this.mensajeError = 'Por favor, utiliza un correo institucional válido.';
      return;
    }

    this.cargando = true;

    try {
      // Iniciar sesión
      await this.usuarioService.login(this.email, this.password);
      this.router.navigate(['/configurar-perfil']);
    } catch (error: any) {
      this.mensajeError = 'Error al iniciar sesión. Verifica tus credenciales.';
      console.error('Error en inicio de sesión:', error);
    } finally {
      this.cargando = false;
    }
  }
}
