// src/app/services/user.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Validar correo: envía código al correo del usuario
  sendValidationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar-correo`, { email });
  }

  // Verificar código que ingresó el usuario
  verifyCode(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-codigo`, { email, codigo });
  }

  // Registrar usuario con manejo de error personalizado
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        const mensaje = error.error?.error || 'Error al registrar usuario';
        return throwError(() => new Error(mensaje));
      })
    );
  }

  // Obtener tipos de ubicación
  getTiposUbicacion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tipoubica`);
  }

  // Obtener ubicaciones por tipo
  getUbicacionesPorTipo(tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ubicaciones/tipo/${tipo}`);
  }

  // Obtener todas las ubicaciones
  getUbicaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ubicaciones`);
  }
  // Verifica si el usuario ya está registrado
  existsUser(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/usuarios/existe/${username}`);
  }

}
