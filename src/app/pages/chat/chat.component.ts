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

// Interfaces para modelar la estructura de conversaciones y mensajes
interface Conversacion {
  id: string;
  nombre: string;
  tipo: 'amigo' | 'grupo';
  ultimahora: Date | null;
  ultimomensaje: string | null;
  ultimotipocontenido?: string;
  ultimotipoarchivo?: string;
}

interface Mensaje {
  propio: boolean;
  remitente: string;
  contenido: string;
  fecha: Date;
  respuestaDe?: { autor: string; texto: string; tipoArchivo?: string } | null;
  CONSECUSER?: string;
  USE_CONSECUSER?: string;
  CONSMENSAJE?: number;
  idTipoContenido?: string;
  idTipoArchivo?: string;
  conseContenido?: number;
  esArchivo?: boolean;
  archivoUrl?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  // Variables principales del componente
  usuario: any = null;
  fechaActual = new Date();
  horaActual = new Date();

  conversacionesOrdenadas: Conversacion[] = [];
  chatActivo: (Conversacion & { mensajes: Mensaje[] }) | null = null;
  nuevoMensaje = '';
  selectedFile: File | null = null;
  mensajeSeleccionado: Mensaje | null = null;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  mensajeContextual: Mensaje | null = null;

  // Referencias al DOM
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatMessages', { static: false })
  private chatMessagesContainer!: ElementRef<HTMLElement>;

  private needsScroll = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Carga de usuario desde localStorage
    const stored = localStorage.getItem('usuario');
    if (!stored) return;
    this.usuario = JSON.parse(stored);

    // Carga y ordenamiento de conversaciones
    this.chatService.getConversaciones(this.usuario.CONSECUSER).subscribe(data => {
      this.conversacionesOrdenadas = data
        .map((c: any): Conversacion => ({
          id: c.id,
          nombre: c.nombre,
          tipo: c.tipo,
          ultimahora: c.ultimahora ? new Date(c.ultimahora) : null,
          ultimomensaje: c.ultimomensaje || null,
          ultimotipocontenido: c.ultimotipocontenido,
          ultimotipoarchivo: c.ultimotipoarchivo
        }))
        .sort((a, b) => (b.ultimahora?.getTime() ?? 0) - (a.ultimahora?.getTime() ?? 0));
    });

    // Actualiza hora cada minuto
    setInterval(() => (this.horaActual = new Date()), 60000);
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  // Carga mensajes al seleccionar una conversación
  abrirConversacion(chat: Conversacion): void {
    this.chatActivo = { ...chat, mensajes: [] };

    this.chatService.getMensajes(chat.tipo, chat.id, this.usuario.CONSECUSER).subscribe(ms => {
      if (!this.chatActivo) return;

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

        // Asigna remitente dependiendo si es grupo o amigo
        const remitente = chat.tipo === 'grupo'
          ? (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : m.REMITENTE)
          : (m.CONSECUSER === this.usuario.CONSECUSER ? 'Tú' : 'Amig@');

        // Evalúa si es una respuesta a otro mensaje
        const hayRespuesta = m.RESP_CONSECUSER && m.RESP_CONSMENSAJE;
        const respuestaDe = hayRespuesta
          ? {
              autor: m.RESPUESTA_REMITENTE || '[Desconocido]',
              texto: m.RESPUESTA_TEXTO?.trim()
                ? m.RESPUESTA_TEXTO
                : `Archivo adjunto: ${m.RESPUESTA_TIPOARCHIVO || 'archivo'}`
            }
          : null;

        return {
          propio: m.CONSECUSER === this.usuario.CONSECUSER,
          remitente,
          contenido: esArchivo ? '' : m.TEXTO,
          fecha: new Date(m.FECHA),
          respuestaDe,
          CONSECUSER: m.CONSECUSER,
          USE_CONSECUSER: m.USE_CONSECUSER,
          CONSMENSAJE: m.CONSMENSAJE,
          idTipoContenido: m.IDTIPOCONTENIDO,
          idTipoArchivo: m.IDTIPOARCHIVO,
          conseContenido: m.CONSECONTENIDO,
          esArchivo,
          archivoUrl
        };
      }).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

      this.needsScroll = true;
    });
  }

  // Selección de archivo desde el input
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Envía mensaje de texto y/o archivo
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

    const formData = new FormData();
    if (texto) formData.append('texto', texto);
    if (this.selectedFile)
      formData.append('file', this.selectedFile, this.selectedFile.name);
    if (respuesta)
      formData.append('respuestaDe', JSON.stringify(respuesta));

    this.chatService
      .sendMessageWithFile(tipo, id, this.usuario.CONSECUSER, formData)
      .subscribe({
        next: ({ success }) => {
          if (success) {
            this.nuevoMensaje = '';
            this.selectedFile = null;
            this.mensajeSeleccionado = null;
            if (this.fileInput) this.fileInput.nativeElement.value = '';
            this.abrirConversacion(this.chatActivo!);
          }
        }
      });
  }

  // Marca un mensaje para responder
  seleccionarRespuesta(msg: Mensaje): void {
    this.mensajeSeleccionado = msg;
  }

  // Cancela la respuesta
  cancelarRespuesta(): void {
    this.mensajeSeleccionado = null;
  }

  // Muestra el menú contextual (clic derecho)
  abrirMenuContextual(event: MouseEvent, msg: Mensaje): void {
    event.preventDefault();
    this.mensajeContextual = msg;
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.seleccionarRespuesta(msg);
  }

  // Cierra menú contextual
  cerrarMenuContextual(): void {
    this.contextMenuVisible = false;
    this.mensajeContextual = null;
  }

  // Carga el contenido del mensaje para reenviarlo
  reenviarMensaje(): void {
    if (!this.mensajeContextual) return;
    this.nuevoMensaje = this.mensajeContextual.contenido;
    this.contextMenuVisible = false;
    this.mensajeContextual = null;
  }

  // Desplaza la vista del chat hacia el último mensaje
  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatMessagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  // Compara si dos fechas son el mismo día
  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  // Devuelve fecha amigable ("Hoy", "Ayer", o fecha corta)
  humanizeDate(date: Date | null): string {
    if (!date) return '';
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(date, today)) return 'Hoy';
    if (this.isSameDay(date, yesterday)) return 'Ayer';
    return ngFormatDate(date, 'MMM d', 'es-ES');
  }

  // Alias para uso en plantillas
  humanizeConversationDate(date: Date | null): string {
    return this.humanizeDate(date);
  }
}
