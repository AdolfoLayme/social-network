import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router} from '@angular/router'; 
import { UsuarioService } from '../../core/servicios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  async onLogin() {
    this.cargando = true; 
    this.mensajeError = ''; 

    try {
      // Iniciar sesión
      await this.usuarioService.login(this.email, this.password);
      this.cargando = false; 
      this.router.navigate(['/configurar-perfil']); 
    } catch (error: any) {
      this.cargando = false;
      this.mensajeError = 'Error al iniciar sesión. Verifica tus credenciales.';
      console.error('Error en inicio de sesión:', error);
    }
  }
}
