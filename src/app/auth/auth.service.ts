import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string | null = null;
  private db: any = {usuarios: [], acessos: [],funcionarios: [], contratante: [], menu:[]};
  public usuarioLogado: any;


  constructor(private http: HttpClient) {
    this.carregarDb().subscribe({
      next: (data) => {
        this.db = data;
        this.isLoggedIn = false;
        localStorage.setItem('appDb', JSON.stringify(this.db));
        localStorage.setItem('isLoggedIn', JSON.stringify(false));
      },
      error: (error) => {
        console.error('Erro ao carregar DB:', error);
      },
    });
    
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.db = JSON.parse(storedDb);
    }
  }

  private carregarDb(): Observable<any> {
    return this.http.get<any>('../../assets/DB.json');
  }


  login(email: string, senha: string): Observable<boolean> {
    const usuarioEncontrado = this.db.usuarios.find((usuario: any) => usuario.email == email && usuario.senha == senha);

    if (usuarioEncontrado) {
      this.usuarioLogado = usuarioEncontrado;
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
    }

    return of(this.isLoggedIn).pipe(delay(1000));
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    this.isLoggedIn = false;
    this.usuarioLogado = null;
  }
}