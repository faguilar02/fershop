import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

export interface AuthResult {
  success: boolean;
  errors?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string): Observable<AuthResult> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => {
          this.handleAuthSuccess(resp);
          return { success: true };
        }),
        catchError((error: HttpErrorResponse) => {
          this.logout();
          return of({
            success: false,
            errors: this.extractErrorMessages(error),
          });
        })
      );
  }

  register(
    fullName: string,
    email: string,
    password: string
  ): Observable<AuthResult> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        fullName,
        email,
        password,
      })
      .pipe(
        map((resp) => {
          this.handleAuthSuccess(resp);
          return { success: true };
        }),
        catchError((error: HttpErrorResponse) => {
          this.logout();
          return of({
            success: false,
            errors: this.extractErrorMessages(error),
          });
        })
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map((resp) => {
          this.handleAuthSuccess(resp);
          return true;
        }),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({ user, token }: AuthResponse) {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', token);
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

  private extractErrorMessages(error: HttpErrorResponse): string[] {
    // Si el backend devuelve un array de mensajes
    if (error.error?.message && Array.isArray(error.error.message)) {
      return error.error.message.map((msg: string) =>
        this.translateErrorMessage(msg)
      );
    }

    // Si el backend devuelve un solo mensaje como string
    if (error.error?.message && typeof error.error.message === 'string') {
      return [this.translateErrorMessage(error.error.message)];
    }

    // Si hay un mensaje de error genérico
    if (error.error?.error) {
      return [this.translateErrorMessage(error.error.error)];
    }

    // Mensaje por defecto
    return ['Error al procesar la solicitud. Intente nuevamente.'];
  }

  private translateErrorMessage(message: string): string {
    // Limpiar caracteres técnicos como Key ()=() already exists
    const cleanedMessage = message
      .replace(
        /Key \(([^)]+)\)=\(([^)]+)\) already exists\.?/i,
        'El $1 "$2" ya está registrado.'
      )
      .replace(
        /password must be longer than or equal to (\d+) characters?/i,
        'La contraseña debe tener al menos $1 caracteres.'
      )
      .replace(/email must be an? valid email/i, 'El email debe ser válido.')
      .replace(/email should not be empty/i, 'El email es requerido.')
      .replace(/password should not be empty/i, 'La contraseña es requerida.')
      .replace(
        /fullName should not be empty/i,
        'El nombre completo es requerido.'
      )
      .replace(
        /fullName must be longer than or equal to (\d+) characters?/i,
        'El nombre debe tener al menos $1 caracteres.'
      )
      .replace(
        /Invalid credentials/i,
        'Credenciales inválidas. Verifica tu email y contraseña.'
      )
      .replace(/User not found/i, 'Usuario no encontrado.')
      .replace(/Unauthorized/i, 'No autorizado.')
      .replace(/Bad Request/i, 'Solicitud incorrecta.');

    // Si no hubo coincidencia, devolver el mensaje original
    return cleanedMessage;
  }
}
