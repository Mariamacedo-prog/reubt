import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/cep.service';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-vendedor-form',
  templateUrl: './vendedor-form.component.html',
  styleUrl: './vendedor-form.component.css'
})
export class VendedorFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private validateService: ValidateService) {}

  vendedorId = 0;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  

  nomeFormControl = new FormControl('', Validators.required);
  cpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPF]);
  ruaFormControl = new FormControl('', [Validators.required]);
  numeroFormControl = new FormControl('', [Validators.required]);
  bairroFormControl = new FormControl('', [Validators.required]);
  complementoFormControl = new FormControl('');
  cidadeUfFormControl = new FormControl('', [Validators.required]);
  rgFormControl = new FormControl('',  Validators.pattern(/^\d{9}$/));
  cepFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);



  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.vendedorId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    if(this.vendedorId){
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);
        if(this.databaseInfo.vendedores ){
          const vendedorPeloCpf = this.databaseInfo.vendedores.find((vendedor: any) => vendedor.id == this.vendedorId);
          if(vendedorPeloCpf){
            this.nomeFormControl.setValue(vendedorPeloCpf.nome);
            this.cpfFormControl.setValue(vendedorPeloCpf.cpf);
            this.emailFormControl.setValue(vendedorPeloCpf.email);
            this.telefoneFormControl.setValue(vendedorPeloCpf.telefone);
            this.rgFormControl.setValue(vendedorPeloCpf.rg);
            this.ruaFormControl.setValue(vendedorPeloCpf.rua);
            this.numeroFormControl.setValue(vendedorPeloCpf.numero);
            this.bairroFormControl.setValue(vendedorPeloCpf.bairro);
            this.complementoFormControl.setValue(vendedorPeloCpf.complemento);
            this.cidadeUfFormControl.setValue(vendedorPeloCpf.cidade_uf);
            this.cepFormControl.setValue(vendedorPeloCpf.cep);
          }
        }
      }
    }
  }

  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.vendedores){
      const vendedorPeloCpf = this.databaseInfo.vendedores.find((vendedor: any) => vendedor.cpf == this.cpfFormControl.value);
      if(vendedorPeloCpf){
        this.toolboxService.showTooltip('error', 'Vendedor(a) com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const vendedorPeloEmail = this.databaseInfo.vendedores.find((vendedor: any) => vendedor.email == this.emailFormControl.value);
      if(vendedorPeloEmail){
        this.toolboxService.showTooltip('error', 'Vendedor(a) com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      this.databaseInfo.vendedores.push(
        {
          "id": Math.floor(Math.random() * 100000),
          "nome":this.nomeFormControl.value,
          "cpf":this.cpfFormControl.value,
          "rua": this.ruaFormControl.value,
          "numero": this.numeroFormControl.value,
          "bairro": this.bairroFormControl.value,
          "complemento": this.complementoFormControl.value,
          "cidade_uf": this.cidadeUfFormControl.value,
          "rg":this.rgFormControl.value,
          "email": this.emailFormControl.value,
          "telefone":this.telefoneFormControl.value,
          "cep": this.cepFormControl.value
        }
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');

      this.router.navigate(['/vendedor/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.vendedores){
      const vendedorPeloCpf = this.databaseInfo.vendedores.find((vendedor: any) => vendedor.cpf == this.cpfFormControl.value && vendedor.id != this.vendedorId);
      if(vendedorPeloCpf){
        this.toolboxService.showTooltip('error', 'Funcionario com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const vendedorPeloEmail = this.databaseInfo.funcionarios.find((vendedor: any) => vendedor.email == this.emailFormControl.value && vendedor.id != this.vendedorId);
      if(vendedorPeloEmail){
        this.toolboxService.showTooltip('error', 'Funcionario com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.vendedores.findIndex((item: any) => item.id == this.vendedorId);
      if (index !== -1) {
        this.databaseInfo.vendedores[index] = {
          "id": this.vendedorId,
          "nome":this.nomeFormControl.value,
          "cpf":this.cpfFormControl.value,
          "email": this.emailFormControl.value,
          "telefone":this.telefoneFormControl.value,
          "rg":this.rgFormControl.value,
          "rua": this.ruaFormControl.value,
          "numero": this.numeroFormControl.value,
          "bairro": this.bairroFormControl.value,
          "complemento": this.complementoFormControl.value,
          "cidade_uf": this.cidadeUfFormControl.value,
          "cep": this.cepFormControl.value
        };
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/vendedor/lista']);
    }
  }

  formularioValido(): boolean {
    return (
        this.nomeFormControl.valid &&
        this.cpfFormControl.valid &&
        this.ruaFormControl.valid &&
        this.numeroFormControl.valid &&
        this.bairroFormControl.valid &&
        this.cidadeUfFormControl.valid &&
        this.emailFormControl.valid &&
        this.telefoneFormControl.valid
    );
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }

  }

  formatarTelefone() {
    if(this.telefoneFormControl.value){
      let telefone = this.telefoneFormControl.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.telefoneFormControl.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.telefoneFormControl.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  buscarEndereco() {
    if(this.cepFormControl.value){
      this.limparEndereco();

      if (this.cepFormControl.value.toString().length === 8) {
        this.cepService.getAddressByCep(this.cepFormControl.value)
          .subscribe(
            data => {
              console.log(data)
              if(!data.erro){
                this.ruaFormControl.setValue(data.logradouro);
                this.bairroFormControl.setValue(data.bairro);
                this.cidadeUfFormControl.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.limparEndereco();
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
    
  }

  limparEndereco(){
    this.ruaFormControl.setValue('');
    this.bairroFormControl.setValue('');
    this.cidadeUfFormControl.setValue('');
  }
}
