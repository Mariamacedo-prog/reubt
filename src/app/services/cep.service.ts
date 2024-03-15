import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor() {}

  getAddressByCep(cep: string): Observable<any> {
    return new Observable<any>((observer) => {
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
