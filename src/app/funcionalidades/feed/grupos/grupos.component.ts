import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  categorias: string[] = ['Estudio', 'Arte', 'Deportes', 'Ciencia', 'Entretenimiento'];

  nuevoGrupo = {
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: ''
  };


  grupos: any[] = []; 

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.obtenerGrupos(); 
  }

  async obtenerGrupos(): Promise<void> {
    const gruposRef = collection(this.firestore, 'grupos');
    const snapshot = await getDocs(gruposRef);
    this.grupos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const lector = new FileReader();
      lector.onload = () => {
        this.nuevoGrupo.imagen = lector.result as string;
      };
      lector.readAsDataURL(input.files[0]);
    }
  }
  
  async subirImagen(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `grupos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async crearGrupo(): Promise<void> {
    try {
      const nuevoGrupo = {
        nombre: this.nuevoGrupo.nombre || 'Grupo sin nombre',
        descripcion: this.nuevoGrupo.descripcion || 'Sin descripción',
        categoria: this.nuevoGrupo.categoria || 'Sin categoría',
        imagen: this.nuevoGrupo.imagen || '/assets/default-group.jpg',
      };
      const grupoRef = collection(this.firestore, 'grupos');
      await addDoc(grupoRef, nuevoGrupo);
      this.grupos.unshift(nuevoGrupo);
      this.nuevoGrupo = { nombre: '', descripcion: '', categoria: '', imagen: '' };
      alert('Grupo creado exitosamente');
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      alert('Hubo un error al crear el grupo. Intenta de nuevo.');
    }
  }

  unirseAGrupo(grupo: any): void {
    alert(`Te has unido al grupo: ${grupo.nombre}`);
  }
}
