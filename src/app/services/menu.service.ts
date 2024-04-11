import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private firestore: AngularFirestore) {}

  getMenuItems(): Observable<any[]> {
    return this.firestore.collection('menu').valueChanges({ idField: 'id' }); 
  }
}
