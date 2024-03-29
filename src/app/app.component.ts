import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { WordService } from './services/word.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn: boolean = true;
  title = 'reurb';
  isMenuOpen: boolean = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  onMenuToggled(isMenuOpen: boolean) {
    this.isMenuOpen = isMenuOpen;
  }
}
