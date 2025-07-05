import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Obtener conversaciones del usuario
  getConversaciones(idUser: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chat/conversaciones/${idUser}`);
  }

  // Obtener últimos mensajes de un chat
  getMensajes(tipo: string, idChat: string, idUsuario: string) {
  return this.http.get<any[]>(`http://localhost:3000/api/chat/mensajes/${tipo}/${idChat}/${idUsuario}`);
  }

  // 🔜 Enviar mensaje
  enviarMensaje(payload: {
    emisor: string;
    receptorId: string;
    tipo: 'amigo' | 'grupo';
    contenido: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/enviar`, payload);
  }
}
