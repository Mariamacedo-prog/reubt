import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { VendedoresService } from '../../../services/vendedores.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vendedor-grid',
  templateUrl: './vendedor-grid.component.html',
  styleUrl: './vendedor-grid.component.css'
})
export class VendedorGridComponent {
  displayedColumns: string[] = ['foto','nome', 'cpf', 'telefone', 'email', 'actions'];
  dataSource:any = [];
  dataSourceFilter:any = [];
  searchTerm: string = '';
  constructor(private router: Router, private toolboxService: ToolboxService, private vendedoresService: VendedoresService,
    public dialog: MatDialog
  ) {}

 
  ngOnInit(): void {
    this.findAll();
  }
  
  findAll(){
    this.vendedoresService.getItems().subscribe(vendedores => {
      if (vendedores.length >= 0) {
        this.dataSource = vendedores;
        this.dataSourceFilter = vendedores;
      }
    });
  }

  addNewVendedor() {
    this.router.navigate(["/vendedor/novo"]);
  }

  search() {
    this.dataSourceFilter = this.dataSource.filter((vendedor: any) => vendedor.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || vendedor.cpf.includes(this.searchTerm));
    if(this.searchTerm.length == 0){
      this.dataSourceFilter = this.dataSource;
    }
  }

  viewItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id + "/visualizar"]);
  }

  editItem(element: any){
    this.router.navigate(["/vendedor/form/" + element.id]);
  }

  deleteItem(element: any){
    console.log(element)
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '300px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.vendedoresService.deleteItem(element.id);
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