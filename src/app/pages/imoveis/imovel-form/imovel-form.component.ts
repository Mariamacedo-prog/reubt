import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/utils/validate.service';
import { CepService } from '../../../services/utils/cep.service';

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

  timeoutId: any;
  filteredCpf: any[] = [];
  loadingCpf: boolean = false;
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private cepService: CepService, private formBuilder: FormBuilder,
    private validateService: ValidateService, 
    ) {}

    contratante = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      id: [0]
    });

    enderecoPorta = this.formBuilder.group({
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      complemento: [''],
      nucleoInformal: ['', Validators.required],
      cidadeUf: ['', Validators.required],
      cep: [''],
      iptu:[''],
      fotos: ['']
    });

  enderecoProjeto = this.formBuilder.group({
    rua: [''],
    quadra: [''],
    lote: [''],
    nucleoInformalProjeto: [''],
    numero: [''],
    bairro: [''],
    complemento: [''],
    cidadeUf: [''],
    cep: ['']
  });

  enderecoDefinitivo = this.formBuilder.group({
    rua: [''],
    numero: [''],
    bairro: [''],
    nucleoInformalDefinitivo: [''],
    complemento: [''],
    cidadeUf: [''],
    cep: [''],
    matricula: ['']
  });




  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      enderecoPorta: this.enderecoPorta,
      enderecoProjeto: this.enderecoProjeto,
      enderecoDefinitivo: this.enderecoDefinitivo,
      contratante: this.contratante
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
      if(this.databaseInfo.imoveis){
        const item = this.databaseInfo.imoveis.find((imovel: any) => imovel.id == this.imovelId);
        console.log(item);
        if(item){

          this.formControls.get('contratante')?.get('nome')?.setValue(item.contratante.nome);
          this.formControls.get('contratante')?.get('cpf')?.setValue(item.contratante.cpf);
          this.formControls.get('contratante')?.get('id')?.setValue(item.contratante.id);
          
          this.formControls.get('enderecoPorta')?.get('rua')?.setValue(item.enderecoPorta.rua);
          this.formControls.get('enderecoPorta')?.get('cep')?.setValue(item.enderecoPorta.cep);
          this.formControls.get('enderecoPorta')?.get('bairro')?.setValue(item.enderecoPorta.bairro);
          this.formControls.get('enderecoPorta')?.get('cidadeUf')?.setValue(item.enderecoPorta.cidadeUf);
          this.formControls.get('enderecoPorta')?.get('complemento')?.setValue(item.enderecoPorta.complemento);
          this.formControls.get('enderecoPorta')?.get('numero')?.setValue(item.enderecoPorta.numero);
          this.formControls.get('enderecoPorta')?.get('iptu')?.setValue(item.enderecoPorta.iptu);
          this.formControls.get('enderecoPorta')?.get('nucleoInformal')?.setValue(item.enderecoPorta.nucleoInformal);
          this.formControls.get('enderecoPorta')?.get('fotos')?.setValue(item.enderecoPorta.fotos);


          this.formControls.get('enderecoDefinitivo')?.get('rua')?.setValue(item.enderecoDefinitivo.rua);
          this.formControls.get('enderecoDefinitivo')?.get('cep')?.setValue(item.enderecoDefinitivo.cep);
          this.formControls.get('enderecoDefinitivo')?.get('bairro')?.setValue(item.enderecoDefinitivo.bairro);
          this.formControls.get('enderecoDefinitivo')?.get('cidadeUf')?.setValue(item.enderecoDefinitivo.cidadeUf);
          this.formControls.get('enderecoDefinitivo')?.get('complemento')?.setValue(item.enderecoDefinitivo.complemento);
          this.formControls.get('enderecoDefinitivo')?.get('numero')?.setValue(item.enderecoDefinitivo.numero);
          this.formControls.get('enderecoDefinitivo')?.get('nucleoInformalDefinitivo')?.setValue(item.enderecoDefinitivo.nucleoInformalDefinitivo);
          this.formControls.get('enderecoDefinitivo')?.get('matricula')?.setValue(item.enderecoDefinitivo.matricula);

          this.formControls.get('enderecoProjeto')?.get('rua')?.setValue(item.enderecoProjeto.rua);
          this.formControls.get('enderecoProjeto')?.get('cep')?.setValue(item.enderecoProjeto.cep);
          this.formControls.get('enderecoProjeto')?.get('bairro')?.setValue(item.enderecoProjeto.bairro);
          this.formControls.get('enderecoProjeto')?.get('cidadeUf')?.setValue(item.enderecoProjeto.cidadeUf);
          this.formControls.get('enderecoProjeto')?.get('nucleoInformalProjeto')?.setValue(item.enderecoProjeto.nucleoInformalProjeto);
          this.formControls.get('enderecoProjeto')?.get('quadra')?.setValue(item.enderecoProjeto.quadra);
          this.formControls.get('enderecoProjeto')?.get('lote')?.setValue(item.enderecoProjeto.lote);
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
    
    console.log("imoveis",this.databaseInfo.imoveis);
    if(this.databaseInfo.imoveis){

      const prefeituraPeloEmail = this.databaseInfo.prefeituras.find((item: any) => item.prefeitura.email == this.formControls.get('prefeitura')?.get('email')?.value && item.id != this.imovelId);
      if(prefeituraPeloEmail){
        this.toolboxService.showTooltip('error', 'Prefeitura com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.imoveis.findIndex((item: any) => item.id == this.imovelId);

      if (index !== -1) {
        this.formControls.get('id')?.setValue(this.imovelId);
        this.databaseInfo.imoveis[index] = this.formControls.getRawValue();
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/imovel/lista']);
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

  localizaContrante(){
    const contratanteByCpf = this.databaseInfo.contratantes.find((item: any) => item.cpf == this.formControls.get('contratante')?.get('cpf')?.value);
    if(contratanteByCpf){
      this.formControls.get('contratante')?.get('nome')?.setValue(contratanteByCpf.nome);
      this.formControls.get('contratante')?.get('id')?.setValue(contratanteByCpf.id);
      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));
    }else{
      this.toolboxService.showTooltip('error', 'Contratante não encontrado na base de dados!', 'ERRO CPF!');
    }
  }

  
  handleKeyUp(event: any){
    this.loadingCpf = true;
    clearTimeout(this.timeoutId); 
    const cpf = event.target.value.trim();
    if (cpf.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.buscarCpf(cpf);
      }, 2000); 
    } else {

      this.filteredCpf = [];
    }
  }

  buscarCpf(cpf: string) {
    this.filteredCpf = this.databaseInfo.contratantes.filter((item: any) => {
      return item.cpf?.includes(cpf);
    });
    this.loadingCpf = false;
  }

  selectedCpf(option: any){
    this.loadingCpf = false;
    if(option){
      this.formControls.get('contratante')?.get('nome')?.setValue(option.nome);
      this.formControls.get('contratante')?.get('id')?.setValue(option.id);
      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));
    }else{
      this.toolboxService.showTooltip('error', 'Contratante não encontrado na base de dados!', 'ERRO CPF!');
    }
  }
}
