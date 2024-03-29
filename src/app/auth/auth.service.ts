import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router,private http: HttpClient) {
    this.carregarDb().subscribe({
      next: (data) => {
        this.db = data;
        this.isLoggedIn = false;
        this.saveDb();
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

  ngOnDestroy(): void {
    this.saveAndLogout();
    window.removeEventListener('beforeunload', () => this.saveAndLogout());
  }

  private saveDb(): void {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.db = JSON.parse(storedDb);
    }

    localStorage.setItem('appDb', JSON.stringify(this.db));
  }

  private saveAndLogout(): void {
    this.saveDb();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('appDb');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.usuarioLogado = null;
  }

  private carregarDb(): Observable<any> {
    return this.http.get<any>('../../assets/DB.json');
  }

  isUserLoggedIn(): boolean{
    return this.isLoggedIn;
  }

  login(cpf: string, senha: string): Observable<boolean> {
    this.saveDb()
    const usuarioEncontrado = this.db.usuarios.find((usuario: any) => usuario.cpf == cpf && usuario.senha == senha);

    if (usuarioEncontrado) {
      this.usuarioLogado = usuarioEncontrado;
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
    }

    return of(this.isLoggedIn).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('appDb');
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.usuarioLogado = null;
    this.router.navigate(['/login']);
  }
}