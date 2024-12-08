export interface Publicaciones {
    id: string;
    descripcion: string;
    fecha: any; // Timestamp de Firestore
    imagen?: string;
    likes: string[];
    usuario: string;
    usuarioImagen: string;
    usuarioUid: string;
  }
  