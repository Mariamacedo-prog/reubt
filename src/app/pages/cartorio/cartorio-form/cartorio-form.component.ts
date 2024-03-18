import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../../services/cep.service';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-cartorio-form',
  templateUrl: './cartorio-form.component.html',
  styleUrl: './cartorio-form.component.css'
})
export class CartorioFormComponent {
  cartorioId = 0;
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

  cartorioFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cnpj: ['', [Validators.required, this.validateService.validateCNPJ]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required],
    cep: ['', Validators.required]
  });

  representanteFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    cpf: ['', [Validators.required, this.validateService.validateCPF]],
    rg: ['', [Validators.required, this.validateService.validateRG]],
    cargo:['', [Validators.required]],
  });



  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      cartorio: this.cartorioFormControls,
      representante: this.representanteFormControls,
      endereco: this.enderecoFormControls,
    });

    this.route.params.subscribe(params => {
       this.cartorioId = params['id'];

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

    if(this.cartorioId){
      if(this.databaseInfo.cartorios){
        const item = this.databaseInfo.cartorios.find((info: any) => info.id == this.cartorioId);
        console.log(item);
        if(item){
          console.log("encontrou o item: ", item)
          this.formControls.get('cartorio')?.get('nome')?.setValue(item.cartorio.nome);
          this.formControls.get('cartorio')?.get('cnpj')?.setValue(item.cartorio.cnpj);
          this.formControls.get('cartorio')?.get('telefone')?.setValue(item.cartorio.telefone);
          this.formControls.get('cartorio')?.get('email')?.setValue(item.cartorio.email);

          this.formControls.get('representante')?.get('nome')?.setValue(item.representante.nome);
          this.formControls.get('representante')?.get('estadoCivil')?.setValue(item.representante.estadoCivil);
          this.formControls.get('representante')?.get('nacionalidade')?.setValue(item.representante.nacionalidade);
          this.formControls.get('representante')?.get('cpf')?.setValue(item.representante.cpf);
          this.formControls.get('representante')?.get('rg')?.setValue(item.representante.rg);

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
    if(this.databaseInfo.cartorios){
      const cartorioPeloCnpj = this.databaseInfo.cartorios.find((item: any) => item.cartorio.cnpj == this.formControls.get('cartorio')?.get('cnpj')?.value);
      if(cartorioPeloCnpj){
        this.toolboxService.showTooltip('error', 'Cartorio com CNPJ já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const cartorioPeloEmail = this.databaseInfo.cartorios.find((item: any) => item.cartorio.email == this.formControls.get('cartorio')?.get('email')?.value);
      if(cartorioPeloEmail){
        this.toolboxService.showTooltip('error', 'Cartorio com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }



      this.formControls.get('id')?.setValue(Math.floor(Math.random() * 100000));

      this.databaseInfo.cartorios.push(
        this.formControls.getRawValue()
      )

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/lista/cartorios']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    console.log("cartorioos",this.databaseInfo.cartorios);
    if(this.databaseInfo.cartorios){
      const cartorioPeloCnpj = this.databaseInfo.cartorios.find((item: any) => item.cartorio.cnpj == this.formControls.get('cartorio')?.get('cnpj')?.value && item.id != this.cartorioId);
      if(cartorioPeloCnpj){
        this.toolboxService.showTooltip('error', 'cartorio com CNPJ já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const cartorioPeloEmail = this.databaseInfo.cartorios.find((item: any) => item.cartorio.email == this.formControls.get('cartorio')?.get('email')?.value && item.id != this.cartorioId);
      if(cartorioPeloEmail){
        this.toolboxService.showTooltip('error', 'cartorio com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.cartorios.findIndex((item: any) => item.id == this.cartorioId);

      if (index !== -1) {
        this.formControls.get('id')?.setValue(this.cartorioId);
        this.databaseInfo.cartorios[index] = this.formControls.getRawValue();
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));
      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/lista/cartorios']);
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
    if(this.formControls.get('cartorio')?.get('telefone')?.value){
      let telefone = this.formControls.get('cartorio')?.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls.get('cartorio')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls.get('cartorio')?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
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
  
  validarGrupo(formGroup: FormGroup): boolean {
    let isValid = true;
  
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control && !control.valid) {
        isValid = false;
      }
    });
  
    return isValid;
  }
}
