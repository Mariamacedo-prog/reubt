import {Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @Output() menuToggled = new EventEmitter<boolean>();

  menuItens: MenuItem[] = [
    { icon: "group", label: 'Usuários', route: '/login' },
    { icon: "how_to_reg", label: 'Acessos ', route: '/acessos'},
    { icon: "account_box", label: 'Funcionários ', route: '/funcionarios'},
    { icon: "tag_faces", label: 'Contratante ', route: '/contratantes'},
    { icon: "location_city", label: 'Imóvel', route: '/imovel'},
    { icon: "nature_people", label: 'Vendedores', route: '/vendedores'},
    { icon: "flag", label: 'Prefeitura ', route: '/prefeitura'},
    { icon: "gavel", label: 'Cartório', route: '/cartorio'},
    { icon: "touch_app", label: 'Serviços/contratos', route: '/serviçosContratos'},
    { icon: "attach_money", label: 'Valores', route: '/valores'},
    { icon: "credit_card", label: 'Pagamentos', route: '/pagamentos'},
    { icon: "timeline", label: 'Juros/parcelamentos', route: '/jurosParcelamentos'},
    { icon: "file_copy", label: 'Arquivos', route: '/arquivos'},
    { icon: "local_atm", label: 'Vendas/pagamentos', route: '/vendasPagamentos'},
    { icon: "insert_link", label: 'Anexos/arquivos/links', route: '/anexosArquivosLinks'},
    { icon: "border_color", label: 'Contratos', route: '/contratos'},
    { icon: "mail", label: 'Emissão ao cartório', route: '/emissaoAoCartorio'},
    { icon: "print", label: 'Importação', route: '/importacao'},
    { icon: "picture_as_pdf", label: 'Relatórios', route: '/relatorios'}
  ];
  isMenuOpen = true;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1100px)');
    this._mobileQueryListener = () => {
      this.isMenuOpen = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggled.emit(this.isMenuOpen);
  }
}

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}