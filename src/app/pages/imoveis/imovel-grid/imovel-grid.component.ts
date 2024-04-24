import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ImoveisService } from '../../../services/imoveis.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-imovel-grid',
  templateUrl: './imovel-grid.component.html',
  styleUrl: './imovel-grid.component.css'
})
export class ImovelGridComponent {
  displayedColumns: string[] = ['nome', 'cpf', 'cidade',  'nucleo', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private imoveisService: ImoveisService, public dialog: MatDialog) {}
  addNew() {
    this.router.navigate(["/imovel/novo"]);
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.imoveisService.getItems().subscribe(imoveis => {
      if (imoveis.length >= 0) {
        this.dataSource = imoveis;
        this.dataSourceFilter = imoveis;
      }
    });
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((imovel: any) => imovel.contratante.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || imovel.contratante.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/imovel/form/" + element.id]);
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.imoveisService.deleteItem(element.id);
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