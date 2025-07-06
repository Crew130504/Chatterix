import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, formatDate as ngFormatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

interface Conversacion {
  id: string;
  nombre: string;
  tipo: 'amigo' | 'grupo';
  ultimahora: Date | null;
  ultimomensaje: string | null;
}

interface Mensaje {
  propio: boolean;
  remitente: string;
  contenido: string;
  fecha: Date;
  respuestaDe?: {
  autor: string;
  texto: string;
  } | null;
  CONSECUSER?: string;
  USE_CONSECUSER?: string;
  CONSMENSAJE?: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  usuario: any = null;
  fechaActual = new Date();
  horaActual  = new Date();

  conversacionesOrdenadas: Conversacion[] = [];
  chatActivo: (Conversacion & { mensajes: Mensaje[] }) | null = null;
  nuevoMensaje = '';
  mensajeSeleccionado: Mensaje | null = null;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  mensajeContextual: Mensaje | null = null;


  @ViewChild('chatMessages', { static: false })
  private chatMessagesContainer!: ElementRef<HTMLElement>;

  private needsScroll = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('usuario');
    if (!stored) return;
    this.usuario = JSON.parse(stored);

    this.chatService.getConversaciones(this.usuario.CONSECUSER)
      .subscribe(data => {
        this.conversacionesOrdenadas = data
          .map((c: any): Conversacion => ({
            id:            c.id,
            nombre:        c.nombre,
            tipo:          c.tipo,
            ultimahora:    c.ultimahora ? new Date(c.ultimahora) : null,
            ultimomensaje: c.ultimomensaje || null
          }))
          .sort((a, b) => {
            const ta = a.ultimahora?.getTime() ?? 0;
            const tb = b.ultimahora?.getTime() ?? 0;
            return tb - ta;
          });
      });

    setInterval(() => this.horaActual = new Date(), 60_000);
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  abrirConversacion(chat: Conversacion): void {
    this.chatActivo = { ...chat, mensajes: [] };
    this.chatService.getMensajes(chat.tipo, chat.id, this.usuario.CONSECUSER)
      .subscribe(ms => {
        console.log(ms);
        this.chatActivo!.mensajes = ms
          .map((m: any): Mensaje => ({
            propio:    m.CONSECUSER === this.usuario.CONSECUSER,
            remitente: chat.tipo === 'grupo'
              ? (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : m.REMITENTE)
              : (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : 'Amig@'),
            contenido: m.TEXTO,
            fecha:     new Date(m.FECHA),
            respuestaDe: m.RESPUESTA_REMITENTE && m.RESPUESTA_TEXTO
              ? {
                  autor: m.RESPUESTA_REMITENTE,
                  texto: m.RESPUESTA_TEXTO
                }
              : null,
            CONSECUSER: m.CONSECUSER,
            USE_CONSECUSER: m.USE_CONSECUSER,
            CONSMENSAJE: m.CONSMENSAJE
          }))
          .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

        this.needsScroll = true;
      });
  }

  enviarMensaje(): void {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.chatActivo) return;

    const { tipo, id } = this.chatActivo;

  const respuesta: [string, string, number] | null = this.mensajeSeleccionado
    ? [
        this.mensajeSeleccionado.CONSECUSER as string,
        this.mensajeSeleccionado.USE_CONSECUSER as string,
        this.mensajeSeleccionado.CONSMENSAJE as number
      ]
    : null;
    console.log('Mensaje seleccionado:', this.mensajeSeleccionado);
  console.log('Enviando respuesta:', respuesta)

    this.chatService
      .sendMessage(tipo, id, this.usuario.CONSECUSER, texto, respuesta)
      .subscribe({
        next: ({ success }) => {
          if (success) {
            this.nuevoMensaje = '';
            this.mensajeSeleccionado = null;
            this.abrirConversacion(this.chatActivo!);
          }
        },
        error: err => console.error('Error al enviar mensaje', err)
      });
  }

  seleccionarRespuesta(msg: Mensaje): void {
    console.log('Mensaje seleccionado:', msg);
    this.mensajeSeleccionado = msg;
  }

  cancelarRespuesta(): void {
    this.mensajeSeleccionado = null;
  }
  abrirMenuContextual(event: MouseEvent, msg: Mensaje): void {
  event.preventDefault(); // cancela el menú contextual del navegador
  this.mensajeContextual = msg;
  this.contextMenuVisible = true;
  this.contextMenuPosition = { x: event.clientX, y: event.clientY };
  this.seleccionarRespuesta(msg);
}

cerrarMenuContextual(): void {
  this.contextMenuVisible = false;
  this.mensajeContextual = null;
}

reenviarMensaje(): void {
  if (!this.mensajeContextual) return;

  this.nuevoMensaje = this.mensajeContextual.contenido;
  this.contextMenuVisible = false;
  this.mensajeContextual = null;
}


  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatMessagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear()
        && d1.getMonth()    === d2.getMonth()
        && d1.getDate()     === d2.getDate();
  }

  humanizeDate(date: Date | null): string {
    if (!date) return '';
    const today     = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDay(date, today))     return 'Hoy';
    if (this.isSameDay(date, yesterday)) return 'Ayer';
    return ngFormatDate(date, 'MMM d', 'es-ES');
  }

  humanizeConversationDate(date: Date | null): string {
    return this.humanizeDate(date);
  }
}
