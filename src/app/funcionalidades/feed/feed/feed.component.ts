import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
 


  currentView: string = 'feed'; 

  cambiarVista(vista: string): void {
    this.currentView = vista; 
  }
  constructor(private router: Router) {}

  // Navegar directamente con rutas configuradas
  navegarAVista(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
