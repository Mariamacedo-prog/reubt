import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/utils/cep.service';
import { ValidateService } from '../../../services/utils/validate.service';

@Component({
  selector: 'app-prefeitura-form',
  templateUrl: './prefeitura-form.component.html',
  styleUrl: './prefeitura-form.component.css'
})
export class PrefeituraFormComponent {
  prefeituraId = 0;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  estadoCivil: any = {};
  formControls!: FormGroup; 

  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private formBuilder: FormBuilder,
    private validateService: ValidateService, 
    ) {}

  prefeituraFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cnpj: ['', [Validators.required, this.validateService.validateCNPJ]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  representanteFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cargo: ['', Validators.required]
  });

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required]
  });

responsavelFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    cpf: ['', [Validators.required, this.validateService.validateCPF]],
    rg: ['', [Validators.required, this.validateService.validateRG]],
  });



  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      responsavel: this.responsavelFormControls,
      prefeitura: this.prefeituraFormControls,
      representante: this.representanteFormControls,
      endereco: this.enderecoFormControls,
    });

    this.route.params.subscribe(params => {
       this.prefeituraId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);
        this.estadoCivil = this.databaseInfo.estadoCivil;
      }

    if(this.prefeituraId){
      if(this.databaseInfo.prefeituras){
        const item = this.databaseInfo.prefeituras.find((prefeitura: any) => prefeitura.id == this.prefeituraId);
        console.log(item);
        if(item){
          console.log("encontrou o item: ", item)
          this.formControls.get('prefeitura')?.get('nome')?.setValue(item.prefeitura.nome);
          this.formControls.get('prefeitura')?.get('cnpj')?.setValue(item.prefeitura.cnpj);
          this.formControls.get('prefeitura')?.get('telefone')?.setValue(item.prefeitura.telefone);
          this.formControls.get('prefeitura')?.get('email')?.setValue(item.prefeitura.email);

          this.formControls.get('responsavel')?.get('nome')?.setValue(item.responsavel.nome);
          this.formControls.get('responsavel')?.get('estadoCivil')?.setValue(item.responsavel.estadoCivil);
          this.formControls.get('responsavel')?.get('nacionalidade')?.setValue(item.responsavel.nacionalidade);
          this.formControls.get('responsavel')?.get('cpf')?.setValue(item.responsavel.cpf);
          this.formControls.get('responsavel')?.get('rg')?.setValue(item.responsavel.rg);

          this.formControls.get('representante')?.get('nome')?.setValue(item.representante.nome);
          this.formControls.get('representante')?.get('cargo')?.setValue(item.representante.cargo);

          this.formControls.get('endereco')?.get('rua')?.setValue(item.endereco.rua);
          this.formControls.get('endereco')?.get('cep')?.setValue(item.endereco.cep);
          this.formControls.get('endereco')?.get('bairro')?.setValue(item.endereco.bairro);
          this.formControls.get('endereco')?.get('cidadeUf')?.setValue(item.endereco.cidadeUf);
          this.formControls.get('endereco')?.get('complemento')?.setValue(item.endereco.complemento);
          this.formControls.get('endereco')?.get('numero')?.setValue(item.endereco.numero);
        }
      }
    }
  }

  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.prefeituras){
      const prefeituraPeloCnpj = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.cnpj == this.formControls.get('prefeitura')?.get('cnpj')?.value);
      if(prefeituraPeloCnpj){
        this.toolboxService.showTooltip('error', 'Prefeitura com CNPJ já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const prefeituraPeloEmail = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.email == this.formControls.get('prefeitura')?.get('email')?.value);
      if(prefeituraPeloEmail){
        this.toolboxService.showTooltip('error', 'Prefeitura com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }



      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));

      this.databaseInfo.prefeituras.push(
        this.formControls.getRawValue()
      )

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/prefeitura/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    console.log("prefeituraas",this.databaseInfo.prefeituras);
    if(this.databaseInfo.prefeituras){
      const prefeituraPeloCnpj = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.cnpj == this.formControls.get('prefeitura')?.get('cnpj')?.value && item.id != this.prefeituraId);
      if(prefeituraPeloCnpj){
        this.toolboxService.showTooltip('error', 'Prefeitura com CNPJ já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const prefeituraPeloEmail = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.email == this.formControls.get('prefeitura')?.get('email')?.value && item.id != this.prefeituraId);
      if(prefeituraPeloEmail){
        this.toolboxService.showTooltip('error', 'Prefeitura com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.prefeituras.findIndex((item: any) => item.id == this.prefeituraId);

      if (index !== -1) {
        this.formControls.get('id')?.setValue(this.prefeituraId);
        this.databaseInfo.prefeituras[index] = this.formControls.getRawValue();
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/prefeitura/lista']);
    }
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }

  formatarTelefone() {
    if(this.formControls.get('prefeitura')?.get('telefone')?.value){
      let telefone = this.formControls.get('prefeitura')?.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('prefeitura')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls.get('prefeitura')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  buscarEndereco() {
    this.formControls.get('endereco')?.get('cep')?.value;
    if(  this.formControls.get('endereco')?.get('cep')?.value){
      this.limparEndereco();
      if (  this.formControls.get('endereco')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('endereco')?.get('cep')?.value)
          .subscribe(
            data => {
              console.log(data)
              if(!data.erro){
                this.formControls.get('endereco')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('endereco')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('endereco')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
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
    this.formControls.get('endereco')?.get('rua')?.setValue("");
    this.formControls.get('endereco')?.get('bairro')?.setValue("");
    this.formControls.get('endereco')?.get('cidadeUf')?.setValue("")
  }

  formularioValido(): boolean {
    return this.formControls.valid;
  }
  

}
