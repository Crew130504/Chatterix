import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule, formatDate as ngFormatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

interface Conversacion {
  id: string;
  nombre: string;
  tipo: 'amigo' | 'grupo';
  ultimahora: Date | null;
  ultimomensaje: string | null;
  ultimotipocontenido?: string;  // '1' si es archivo
  ultimotipoarchivo?   : string;  // 'PDF', 'BMP', etc.
}


interface Mensaje {
  propio: boolean;
  remitente: string;
  contenido: string;
  fecha: Date;
  respuestaDe?: { autor: string; texto: string } | null;
  CONSECUSER?: string;
  USE_CONSECUSER?: string;
  CONSMENSAJE?: number;
  // nuevos campos:
  idTipoContenido?: string;
  idTipoArchivo?   : string;
  conseContenido?  : number;
  esArchivo?       : boolean;
  archivoUrl?      : string;
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
  selectedFile: File | null = null;
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

    this.chatService
      .getConversaciones(this.usuario.CONSECUSER)
      .subscribe(data => {
        this.conversacionesOrdenadas = data
          .map((c: any): Conversacion => ({
            id:            c.id,
            nombre:        c.nombre,
            tipo:          c.tipo,
            ultimahora:    c.ultimahora ? new Date(c.ultimahora) : null,
            ultimomensaje: c.ultimomensaje || null,
            ultimotipocontenido:c.ultimotipocontenido,
            ultimotipoarchivo:  c.ultimotipoarchivo
          }))
          .sort((a, b) => (b.ultimahora?.getTime() ?? 0) - (a.ultimahora?.getTime() ?? 0));
      });

    setInterval(() => (this.horaActual = new Date()), 60_000);
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  abrirConversacion(chat: Conversacion): void {
    this.chatActivo = { ...chat, mensajes: [] };

    this.chatService
      .getMensajes(chat.tipo, chat.id, this.usuario.CONSECUSER)
      .subscribe(ms => {
        if (!this.chatActivo) return;  // Aseguramos non-null

        this.chatActivo.mensajes = ms.map((m: any): Mensaje => {
          const esArchivo = m.IDTIPOCONTENIDO === '1';
          const archivoUrl = esArchivo
            ? this.chatService.getArchivoUrl(
                m.CONSECUSER,
                m.USE_CONSECUSER ?? '',
                m.CONSMENSAJE,
                m.CONSECONTENIDO
              )
            : '';

          // Determinar remitente visible
          const remitente = chat.tipo === 'grupo'
            ? (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : m.REMITENTE)
            : (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : 'Amig@');

          // Construir objeto respuestaDe
          const respuestaDe = m.RESPUESTA_REMITENTE && m.RESPUESTA_TEXTO
            ? { autor: m.RESPUESTA_REMITENTE, texto: m.RESPUESTA_TEXTO }
            : null;

          return {
            propio:         m.CONSECUSER === this.usuario.CONSECUSER,
            remitente,
            contenido:      esArchivo ? '' : m.TEXTO,
            fecha:          new Date(m.FECHA),
            respuestaDe,
            CONSECUSER:     m.CONSECUSER,
            USE_CONSECUSER: m.USE_CONSECUSER,
            CONSMENSAJE:    m.CONSMENSAJE,
            idTipoContenido: m.IDTIPOCONTENIDO,
            idTipoArchivo:   m.IDTIPOARCHIVO,
            conseContenido:  m.CONSECONTENIDO,
            esArchivo,
            archivoUrl
          };
        })
        .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

        this.needsScroll = true;
      });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('[DEBUG] Archivo seleccionado:', this.selectedFile);
    }
  }

  enviarMensaje(): void {
    if (!this.chatActivo) return;
    const { tipo, id } = this.chatActivo;
    const texto = this.nuevoMensaje.trim();

    const respuesta = this.mensajeSeleccionado
      ? [
          this.mensajeSeleccionado.CONSECUSER as string,
          this.mensajeSeleccionado.USE_CONSECUSER as string,
          this.mensajeSeleccionado.CONSMENSAJE as number
        ]
      : null;

    console.log('[DEBUG] Texto a enviar:', texto);
    console.log('[DEBUG] RespuestaDe:', respuesta);
    console.log('[DEBUG] Archivo actual:', this.selectedFile);

    const formData = new FormData();
    if (texto) formData.append('texto', texto);
    if (this.selectedFile)
      formData.append('file', this.selectedFile, this.selectedFile.name);
    if (respuesta)
      formData.append('respuestaDe', JSON.stringify(respuesta));

    // Verificar contenido de FormData
    for (const entry of formData.entries()) {
      console.log('[DEBUG] FormData entry:', entry);
    }

    this.chatService
      .sendMessageWithFile(tipo, id, this.usuario.CONSECUSER, formData)
      .subscribe({
        next: ({ success }) => {
          console.log('[DEBUG] Servidor devolvió éxito:', success);
          if (success) {
            this.nuevoMensaje = '';
            this.selectedFile = null;
            this.mensajeSeleccionado = null;
            this.abrirConversacion(this.chatActivo!);
          }
        },
        error: err => console.error('[DEBUG] Error al enviar mensaje:', err)
      });
  }

  seleccionarRespuesta(msg: Mensaje): void {
    console.log('[DEBUG] Mensaje marcado para respuesta:', msg);
    this.mensajeSeleccionado = msg;
  }

  cancelarRespuesta(): void {
    this.mensajeSeleccionado = null;
  }

  abrirMenuContextual(event: MouseEvent, msg: Mensaje): void {
    event.preventDefault();
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
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  humanizeDate(date: Date | null): string {
    if (!date) return '';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(date, today)) return 'Hoy';
    if (this.isSameDay(date, yesterday)) return 'Ayer';
    return ngFormatDate(date, 'MMM d', 'es-ES');
  }

  humanizeConversationDate(date: Date | null): string {
    return this.humanizeDate(date);
  }
}
