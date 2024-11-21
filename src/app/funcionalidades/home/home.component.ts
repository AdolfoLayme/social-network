import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  email: string = '';
  password: string = '';

  onLogin() {
    console.log('Iniciando sesión con:', this.email, this.password);

  }
}
