import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reurb2';
  isMenuOpen: boolean = false;

  onMenuToggled(isMenuOpen: boolean) {
    this.isMenuOpen = isMenuOpen;
    console.log("oi oi")
  }
}
