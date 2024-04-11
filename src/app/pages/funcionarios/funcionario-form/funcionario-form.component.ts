import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.css'
})
export class FuncionarioFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private validateService: ValidateService) {}

  funcionarioId = 0;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: any[] = [];
  visualizar: boolean = false;

  timeoutId: any;
  filteredUsuario: any[] = [];
  loadingUsuario: boolean = false;

  nomeFormControl = new FormControl('', Validators.required);
  cpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPF]);
  ruaFormControl = new FormControl('', [Validators.required]);
  numeroFormControl = new FormControl('', [Validators.required]);
  bairroFormControl = new FormControl('', [Validators.required]);
  complementoFormControl = new FormControl('');
  cidadeUfFormControl = new FormControl('', [Validators.required]);
  usuarioFormControl = new FormControl('', [Validators.required]);
  cepFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);


  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.funcionarioId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    if(this.funcionarioId){
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);
        if(this.databaseInfo.funcionarios ){
          const funcionarioPeloCpf = this.databaseInfo.funcionarios.find((funcionario: any) => funcionario.id == this.funcionarioId);
          if(funcionarioPeloCpf){
            this.nomeFormControl.setValue(funcionarioPeloCpf.nome);
            this.cpfFormControl.setValue(funcionarioPeloCpf.cpf);
            this.emailFormControl.setValue(funcionarioPeloCpf.email);
            this.telefoneFormControl.setValue(funcionarioPeloCpf.telefone);
            this.usuarioFormControl.setValue(funcionarioPeloCpf.usuario);
            this.ruaFormControl.setValue(funcionarioPeloCpf.rua);
            this.numeroFormControl.setValue(funcionarioPeloCpf.numero);
            this.bairroFormControl.setValue(funcionarioPeloCpf.bairro);
            this.complementoFormControl.setValue(funcionarioPeloCpf.complemento);
            this.cidadeUfFormControl.setValue(funcionarioPeloCpf.cidadeUf);
            this.cepFormControl.setValue(funcionarioPeloCpf.cep);
          }
        }
      }
    }
  }

  buscarUsuario(nome: string) {
    if (this.usuarioFormControl.value) {
      const filterValue = this.usuarioFormControl.value.toString().toLowerCase();

      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);

        this.filteredOptions = this.databaseInfo.usuarios.filter((item: any) => {
          return item.nome.toLowerCase().includes(nome.toLowerCase());
        });
        this.loadingUsuario = false;
      }
    }
 
  }

  handleKeyUp(event: any){
    this.loadingUsuario = true;
    clearTimeout(this.timeoutId); 
    let nome = event.target.value.trim();
    if (nome.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.buscarUsuario(nome);
      }, 2000); 
    } else {

      this.filteredUsuario = [];
    }
  }



  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.funcionarios){
      const funcionarioPeloCpf = this.databaseInfo.funcionarios.find((funcionario: any) => funcionario.cpf == this.cpfFormControl.value);
      if(funcionarioPeloCpf){
        this.toolboxService.showTooltip('error', 'Funcionario com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const funcionarioPeloEmail = this.databaseInfo.funcionarios.find((funcionario: any) => funcionario.email == this.emailFormControl.value);
      if(funcionarioPeloEmail){
        this.toolboxService.showTooltip('error', 'Funcionario com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      this.databaseInfo.funcionarios.push(
        {
          "id": Math.floor(Math.random() * 100000),
          "nome":this.nomeFormControl.value,
          "cpf":this.cpfFormControl.value,
          "rua": this.ruaFormControl.value,
          "numero": this.numeroFormControl.value,
          "bairro": this.bairroFormControl.value,
          "complemento": this.complementoFormControl.value,
          "cidadeUf": this.cidadeUfFormControl.value,
          "usuario":this.usuarioFormControl.value,
          "email": this.emailFormControl.value,
          "telefone":this.telefoneFormControl.value,
          "cep": this.cepFormControl.value
        }
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/funcionario/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.funcionarios){
      const funcionarioPeloCpf = this.databaseInfo.funcionarios.find((funcionario: any) => funcionario.cpf == this.cpfFormControl.value && funcionario.id != this.funcionarioId);
      if(funcionarioPeloCpf){
        this.toolboxService.showTooltip('error', 'Funcionario com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const funcionarioPeloEmail = this.databaseInfo.funcionarios.find((funcionario: any) => funcionario.email == this.emailFormControl.value && funcionario.id != this.funcionarioId);
      if(funcionarioPeloEmail){
        this.toolboxService.showTooltip('error', 'Funcionario com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.funcionarios.findIndex((item: any) => item.id == this.funcionarioId);
      if (index !== -1) {
        this.databaseInfo.funcionarios[index] = {
          "id": this.funcionarioId,
          "nome":this.nomeFormControl.value,
          "cpf":this.cpfFormControl.value,
          "rua": this.ruaFormControl.value,
          "numero": this.numeroFormControl.value,
          "bairro": this.bairroFormControl.value,
          "complemento": this.complementoFormControl.value,
          "cidadeUf": this.cidadeUfFormControl.value,
          "usuario":this.usuarioFormControl.value,
          "email": this.emailFormControl.value,
          "telefone":this.telefoneFormControl.value,
          "cep": this.cepFormControl.value
        };
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/funcionario/lista']);
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
        this.usuarioFormControl.valid &&
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
