import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { CartoriosService } from '../../../services/cartorios.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cartorio-grid',
  templateUrl: './cartorio-grid.component.html',
  styleUrl: './cartorio-grid.component.css'
})
export class CartorioGridComponent {
  displayedColumns: string[] = ['nome', 'cnpj', 'cns', 'cargo', 'cidade', 'email', 'telefone', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService,
    public dialog: MatDialog,private cartoriosService: CartoriosService ) {}
  newCartorio() {
    this.router.navigate(["/cartorio/novo"]);
  }
 
  ngOnInit(): void {
   this.findAll();
  }

  findAll(){
    this.cartoriosService.getItems().subscribe(catorios => {
      if (catorios.length >= 0) {
        this.dataSource = catorios;
        this.dataSourceFilter = catorios;
      }
    });
  }
  
  search() {
    this.dataSourceFilter = this.dataSource.filter((item: any) => item.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || item.cnpj.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/cartorio/form/" + element.id]);
  }

  deleteItem(element: any){
    const dialogRef = this.dialog.open(DialogDeleteCartorio, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cartoriosService.deleteItem(element.id);
        this.findAll();
      }
    });
  }
}


@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html'
})
export class DialogDeleteCartorio {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteCartorio>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    onYesClick(): void {
      this.dialogRef.close(true);
    }

    onCancelClick(): void {
      this.dialogRef.close(false);
    }
}