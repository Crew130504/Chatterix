import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  enChat = false;
  usuario: any = null;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.enChat = this.router.url.startsWith('/chat');
      const stored = localStorage.getItem('usuario');
      this.usuario = stored ? JSON.parse(stored) : null;
    });
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  forzarRecargaChat(): void {
    const destino = this.enChat ? '/chat' : '/';
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(destino);
    });
  }
}
