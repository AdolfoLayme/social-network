import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerPerfilComponent } from '../../perfil/ver-perfil/ver-perfil.component';
import { Router, RouterModule } from '@angular/router';
import { PublicacionesComponent } from '../publicaciones/publicaciones.component';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, VerPerfilComponent, RouterModule, PublicacionesComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})

export class FeedComponent {
  usuario = {
    nombre: 'Adolfo',
    handle: 'Adolfo_Bonif',
    fotoPerfil: '/icons/icono-perfil.png'
  };

   // Propiedad para controlar la visibilidad del menú
   menuVisible: boolean = false;

   // Método para alternar la visibilidad del menú
   toggleMenu(): void {
     this.menuVisible = !this.menuVisible;
   }
 


  currentView: string = 'feed'; // Vista inicial

  cambiarVista(vista: string): void {
    this.currentView = vista; // Cambia entre 'feed' y 'perfil'
  }
  constructor(private router: Router) {}

  // Navegar directamente con rutas configuradas
  navegarAVista(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
