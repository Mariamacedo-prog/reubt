import {Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() menuToggled = new EventEmitter<boolean>();
  menuItens: MenuItem[] = [];
  isMenuOpen = false;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnInit(): void {
    setTimeout(() => {
      const storedDb = localStorage.getItem('appDb');
       if (storedDb) {
        const parsedDb = JSON.parse(storedDb);
        if (parsedDb.menu) {
          this.menuItens = parsedDb.menu;
        }
      }
    }, 3000)
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1200px)');
    this._mobileQueryListener = () => {
      this.isMenuOpen = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
      
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  isAuthenticated(): boolean | null{
    if(localStorage.getItem('isLoggedIn') == 'true'){
      return true;
    }else{
      return false;
    }
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggled.emit(this.isMenuOpen);
  }
}
