import { Injectable } from '@angular/core';

interface AuthSession {
  token: string;
  role: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly SESSION_KEY = 'auth_session';

  constructor() {}


  setLoginSession(token: string, role: string, userId: number): void {
    const session: AuthSession = { token, role, userId };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }


  private getSession(): AuthSession | null {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;

    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    const session = this.getSession();
    if (!session || this.isTokenExpired(session.token)) return null;
    return session.token;
  }

  getUserRole(): string | null {
    const session = this.getSession();
    return session?.role || null;
  }


  getUserId(): number | null {
    const session = this.getSession();
    return session?.userId ?? null;
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    return !!token && !!role;
  }


  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return !exp || now >= exp;
    } catch {
      return true;
    }
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  clearSession(): void {
    this.logout();
  }
}
