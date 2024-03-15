import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './inputfile.component.html',
  styleUrl: './inputfile.component.css'
})
export class InputfileComponent {
  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Input() nome: string = '';
  nomeBotao: string = 'Selecionar Arquivo';
  maxNomeBotaoLength: number = 25; 

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      // Atualize o texto do botão com o nome do arquivo selecionado
      this.nomeBotao = this.truncateFileName(files[0].name);
    } else {
      // Se nenhum arquivo for selecionado, redefina o texto do botão
      this.nomeBotao = 'Selecionar Arquivo';
    }
  }

  truncateFileName(fileName: string): string {
    if (fileName.length > this.maxNomeBotaoLength) {
      return fileName.substring(0, this.maxNomeBotaoLength) + '...';
    }
    return fileName;
  }
}
