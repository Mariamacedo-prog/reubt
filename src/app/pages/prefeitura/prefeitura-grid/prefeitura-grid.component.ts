import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { PrefeiturasService } from '../../../services/prefeituras.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prefeitura-grid',
  templateUrl: './prefeitura-grid.component.html',
  styleUrl: './prefeitura-grid.component.css'
})
export class PrefeituraGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private prefeiturasService: PrefeiturasService, public dialog: MatDialog ) {}
  adicionarNovaPrefeitura() {
    this.router.navigate(["/prefeitura/nova"]);
  }
 
  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.prefeiturasService.getItems().subscribe(prefeituras => {
      if (prefeituras.length >= 0) {
        this.dataSource = prefeituras;
        this.dataSourceFilter = prefeituras;
      }
    });
  }

  
  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.prefeitura.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.prefeitura.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/prefeitura/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/prefeitura/form/" + element.id]);
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.prefeiturasService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}




@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html'
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    onYesClick(): void {
      this.dialogRef.close(true);
    }

    onCancelClick(): void {
      this.dialogRef.close(false);
    }
}