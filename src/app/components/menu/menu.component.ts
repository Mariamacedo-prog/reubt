import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() menuToggled = new EventEmitter<boolean>();

  menuItens: MenuItem[] = [
    { label: 'Login', route: '/login' },
    { label: 'Teste', route: '/adaddaadaS' }
  ];
  isMenuOpen = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggled.emit(this.isMenuOpen);
  }
}

interface MenuItem {
  label: string;
  route: string;
}