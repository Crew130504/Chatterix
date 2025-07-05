import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  usuario: any = null;
  fechaActual = new Date();
  horaActual = new Date();

  conversacionesOrdenadas: any[] = [];
  chatActivo: any = null;
  nuevoMensaje: string = '';

  constructor(private chatService: ChatService) {}  

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      this.usuario = JSON.parse(stored);

      this.chatService.getConversaciones(this.usuario.CONSECUSER).subscribe(data => {
         console.log('DATA DEL BACKEND', data); 
      this.conversacionesOrdenadas = data.sort((a: any, b: any) => {
        if (a.ultimahora && b.ultimahora) {
          return new Date(b.ultimaHora).getTime() - new Date(a.ultimahora).getTime();
        }
        if (a.ultimahora) return -1;
        if (b.ultimahora) return 1;
        return 0;
      });
    });
    }

    setInterval(() => this.horaActual = new Date(), 60000);
  }

  abrirConversacion(chat: any): void {
    this.chatActivo = {
      ...chat,
      mensajes: []
    };

    this.chatService.getMensajes(chat.tipo, chat.id, this.usuario.CONSECUSER)
      .subscribe(ms => {
        this.chatActivo.mensajes = ms.map((m: any) => ({
          propio   : m.CONSECUSER === this.usuario.CONSECUSER,
          emisor   : chat.tipo === 'grupo'
                      ? (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : m.REMITENTE)
                      : (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : 'Amig@'),
          contenido: m.TEXTO,
          fecha    : new Date(m.FECHA)
        })).sort((a: any, b: any) => +a.FECHA - +b.FECHA);;
    });
  }


enviarMensaje(): void {
  const mensaje = this.nuevoMensaje.trim();
  if (!mensaje || !this.chatActivo || !this.usuario) return;

  const nuevo = {
    emisor: this.usuario.NOMBRE,
    contenido: mensaje,
    fecha: new Date()
  };

  if (!this.chatActivo.mensajes) {
    this.chatActivo.mensajes = [];
  }

  this.chatActivo.mensajes.push(nuevo);
  this.chatActivo.ultimoMensaje = mensaje;
  this.chatActivo.ultimaHora = nuevo.fecha;
  this.nuevoMensaje = '';
}

}
