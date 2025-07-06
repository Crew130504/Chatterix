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

  // ✅ Obtener últimos mensajes de un chat
  getMensajes(tipo: string, idChat: string, idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chat/mensajes/${tipo}/${idChat}/${idUsuario}`);
  }

  // ✅ Enviar mensaje con posible respuesta (hilo)
  sendMessage(
    tipo: 'amigo' | 'grupo',
    idChat: string,
    idUsuario: string,
    texto: string,
    respuestaDe?: [string, string, number] | null
  ): Observable<{ success: boolean; newMessageId: number }> {
    return this.http.post<{ success: boolean; newMessageId: number }>(
      `${this.apiUrl}/chat/mensajes/${tipo}/${idChat}/${idUsuario}`,
      { texto, respuestaDe }
    );
  }

  // ✅ Subir archivo (imagen o adjunto)
  subirArchivo(
    archivo: File,
    consecUser: string,
    useConsecUser: string,
    consMensaje: number,
    tipoContenido: string,
    tipoArchivo: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('consecUser', consecUser);
    formData.append('useConsecUser', useConsecUser);
    formData.append('consMensaje', consMensaje.toString());
    formData.append('tipoContenido', tipoContenido);
    formData.append('tipoArchivo', tipoArchivo);

    return this.http.post(`${this.apiUrl}/subirArchivo`, formData);
  }
}
