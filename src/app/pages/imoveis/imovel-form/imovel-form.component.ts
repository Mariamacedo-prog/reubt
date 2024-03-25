import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/validate.service';
import { CepService } from '../../../services/cep.service';

@Component({
  selector: 'app-imovel-form',
  templateUrl: './imovel-form.component.html',
  styleUrl: './imovel-form.component.css'
})
export class ImovelFormComponent {
  imovelId = 0;
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

    enderecoPorta = this.formBuilder.group({
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: [''],
      cidadeUf: ['', Validators.required],
      cep: ['', Validators.required],
      iptu:['', Validators.required],
      fotos: ['']
    });

  enderecoProjeto = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required]
  });

  enderecoDefinitivo = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required],
    matricula: ['', Validators.required]
  });


  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      enderecoPorta: this.enderecoPorta,
      enderecoProjeto: this.enderecoProjeto,
      enderecoDefinitivo: this.enderecoDefinitivo
    });

    this.route.params.subscribe(params => {
       this.imovelId = params['id'];

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

    if(this.imovelId){
      if(this.databaseInfo.prefeituras){
        const item = this.databaseInfo.prefeituras.find((prefeitura: any) => prefeitura.id == this.imovelId);
        console.log(item);
        if(item){

          this.formControls.get('enderecoPorta')?.get('rua')?.setValue(item.enderecoPorta.rua);
          this.formControls.get('enderecoPorta')?.get('cep')?.setValue(item.enderecoPorta.cep);
          this.formControls.get('enderecoPorta')?.get('bairro')?.setValue(item.enderecoPorta.bairro);
          this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue(item.endeenderecoPortareco.cidadeUf);
          this.formControls.get('enderecoPorta')?.get('complemento')?.setValue(item.enderecoPorta.complemento);
          this.formControls.get('enderecoPorta')?.get('numero')?.setValue(item.enderecoPorta.numero);
          this.formControls.get('enderecoPorta')?.get('iptu')?.setValue(item.enderecoPorta.iptu);
          this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(item.enderecoPorta.fotos);


          this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue(item.enderecoDefinitivo.rua);
          this.formControls.get('enderecoDefinitivo')?.get('cep')?.setValue(item.enderecoDefinitivo.cep);
          this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue(item.enderecoDefinitivo.bairro);
          this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue(item.enderecoDefinitivo.cidadeUf);
          this.formControls.get('enderecoDefinitivo')?.get('complemento')?.setValue(item.enderecoDefinitivo.complemento);
          this.formControls.get('enderecoDefinitivo')?.get('numero')?.setValue(item.enderecoDefinitivo.numero);
          this.formControls.get('enderecoDefinitivo')?.get('matricula')?.setValue(item.enderecoDefinitivo.matricula);

          this.formControls.get('enderecoProjeto')?.get('rua')?.setValue(item.enderecoProjeto.rua);
          this.formControls.get('enderecoProjeto')?.get('cep')?.setValue(item.enderecoProjeto.cep);
          this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue(item.enderecoProjeto.bairro);
          this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue(item.enderecoProjeto.cidadeUf);
          this.formControls.get('enderecoProjeto')?.get('complemento')?.setValue(item.enderecoProjeto.complemento);
          this.formControls.get('enderecoProjeto')?.get('numero')?.setValue(item.enderecoProjeto.numero);
     
        }
      }
    }
  }

  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.imoveis){
      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));

      this.databaseInfo.imoveis.push(
        this.formControls.getRawValue()
      )

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/imovel/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    console.log("prefeituraas",this.databaseInfo.prefeituras);
    if(this.databaseInfo.prefeituras){
      const prefeituraPeloCnpj = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.cnpj == this.formControls.get('prefeitura')?.get('cnpj')?.value && item.id != this.imovelId);
      if(prefeituraPeloCnpj){
        this.toolboxService.showTooltip('error', 'Prefeitura com CNPJ já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const prefeituraPeloEmail = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.email == this.formControls.get('prefeitura')?.get('email')?.value && item.id != this.imovelId);
      if(prefeituraPeloEmail){
        this.toolboxService.showTooltip('error', 'Prefeitura com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.prefeituras.findIndex((item: any) => item.id == this.imovelId);

      if (index !== -1) {
        this.formControls.get('id')?.setValue(this.imovelId);
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


  buscarEnderecoDefinitivo() {
    console.log(this.formControls)
    this.formControls.get('enderecoDefinitivo')?.get('cep')?.value;
    console.log( this.formControls.get('enderecoDefinitivo')?.get('cep')?.value);
    if(  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value){

      this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue("");
      this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue("")

      if (  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoDefinitivo')?.get('cep')?.value)
          .subscribe(
            data => {
              console.log(data)
              if(!data.erro){
                this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue("");
                this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue("");
                this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue("")
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  buscarEnderecoProjeto() {
    console.log(this.formControls)
    this.formControls.get('enderecoProjeto')?.get('cep')?.value;
    console.log( this.formControls.get('enderecoProjeto')?.get('cep')?.value);
    if(  this.formControls.get('enderecoProjeto')?.get('cep')?.value){

      this.formControls.get('enderecoProjeto')?.get('rua')?.setValue("");
      this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue("")

      if (  this.formControls.get('enderecoProjeto')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoProjeto')?.get('cep')?.value)
          .subscribe(
            data => {
              console.log(data)
              if(!data.erro){
                this.formControls.get('enderecoProjeto')?.get('rua')?.setValue(data.logradouro);
                this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue(data.bairro);
                this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
              }else{
                this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
                this.formControls.get('enderecoProjeto')?.get('rua')?.setValue("");
                this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue("");
                this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue("")
              }
            },
            error => {
              console.error(error);
            }
          );
      }
    }
  }

  buscarEnderecoPorta() {
    console.log(this.formControls)
    console.log( this.formControls.get('enderecoPorta')?.get('cep')?.value);
    this.formControls.get('enderecoPorta')?.get('cep')?.value;
    if(  this.formControls.get('enderecoPorta')?.get('cep')?.value){
      this.formControls.get('enderecoPorta')?.get('rua')?.setValue("");
      this.formControls.get('enderecoPorta')?.get('bairro')?.setValue("");
      this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue("")
      if (  this.formControls.get('enderecoPorta')?.get('cep')?.value.toString().length === 8) {
        this.cepService.getAddressByCep(  this.formControls.get('enderecoPorta')?.get('cep')?.value)
        .subscribe(
          data => {
            console.log(data)
            if(!data.erro){
              this.formControls.get('enderecoPorta')?.get('rua')?.setValue(data.logradouro);
              this.formControls.get('enderecoPorta')?.get('bairro')?.setValue(data.bairro);
              this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue(data.localidade + " / " + data.uf)
            }else{
              this.toolboxService.showTooltip('error', 'Cep não localizado!', 'ERRO CEP!');
              this.formControls.get('enderecoPorta')?.get('rua')?.setValue("");
              this.formControls.get('enderecoPorta')?.get('bairro')?.setValue("");
              this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue("")
            }
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }

  formularioValido(): boolean {
    return this.formControls.valid;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(this.formControls, file)
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
      this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(file.name);

      console.log(this.formControls)
      // Faça o que precisar com o arquivo aqui, como enviá-lo para um servidor, etc.
    }
  }
}
