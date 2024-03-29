import { Component } from '@angular/core';
import { WordService } from '../../../services/word.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contratos-form',
  templateUrl: './contratos-form.component.html',
  styleUrl: './contratos-form.component.css'
})
export class ContratosFormComponent {
  contratoId = 0;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  visualizar: boolean = false;
  formControls!: FormGroup;
  filteredContratantes: any[] = [];
  timeoutId: any;

  showDowloadContrato = false;
  parcelamentoInfo: any = {};
  imovelDoContratante: any = {};
  existeImovel:boolean = false;
  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private wordService: WordService) {
    }

  cartorioFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cns: ['', [Validators.required]],
    cidadeUf: ['', [Validators.required]],
  });

  enderecoFormControls = this.formBuilder.group({
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeUf: ['', Validators.required]
  });

  crfFormControls = this.formBuilder.group({
    numerocrf:[0],
    crfentregue:[""],
    statusentrega:[""]
  });

  contratanteFormControls = this.formBuilder.group({
    id: [0, Validators.required],
    nome: ['', Validators.required],
    cpf: ['', [Validators.required]],
    rg: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    nacionalidade: ['', [Validators.required]],
    profissao: ['', [Validators.required]],
    estadoCivil: ['', [Validators.required]],
    imovelId: [0]
  });

  empresaFormControls = this.formBuilder.group({
    nome:["", Validators.required],
    cnpj:["", Validators.required],
    endereco: this.enderecoFormControls
  });

  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      contratante: this.contratanteFormControls,
      crf: this.crfFormControls,
      cartorio: this.cartorioFormControls,
      empresa: this.empresaFormControls
    });
   
    this.route.params.subscribe(params => {
       this.contratoId = params['id'];
      console.log( this.contratoId);
       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);

      if(this.databaseInfo.empresa[0]){
        const empresa = this.databaseInfo.empresa[0];
        this.formControls?.get('empresa')?.get('nome')?.setValue(empresa.nome);
        this.formControls?.get('empresa')?.get('cnpj')?.setValue(empresa.cnpj);
        this.formControls?.get('empresa')?.get('endereco')?.get('rua')?.setValue(empresa.endereco.rua);
        this.formControls?.get('empresa')?.get('endereco')?.get('numero')?.setValue(empresa.endereco.numero);
        this.formControls?.get('empresa')?.get('endereco')?.get('bairro')?.setValue(empresa.endereco.bairro);
        this.formControls?.get('empresa')?.get('endereco')?.get('complemento')?.setValue(empresa.endereco.complemento);
        this.formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.setValue(empresa.endereco.cidadeUf);
      }
  
      if(this.contratoId){
        const contratoPeloCpf = this.databaseInfo.contratos.find((contrato: any) => contrato.id == this.contratoId);
        if(this.databaseInfo.contratos && contratoPeloCpf){
          this.formControls?.get('crf')?.get('numerocrf')?.setValue(contratoPeloCpf.crf.numerocrf);
          this.formControls?.get('crf')?.get('crfentregue')?.setValue(contratoPeloCpf.crf.crfentregue);
          this.formControls?.get('crf')?.get('statusentrega')?.setValue(contratoPeloCpf.crf.statusentrega);

          this.formControls?.get('cartorio')?.get('nome')?.setValue(contratoPeloCpf.cartorio.nome);
          this.formControls?.get('cartorio')?.get('cns')?.setValue(contratoPeloCpf.cartorio.cns);
          const cartorioPorCns = this.databaseInfo.cartorios.find((cartorio: any) => cartorio.cartorio.cns == contratoPeloCpf.cartorio.cns);
          if(cartorioPorCns){
            this.formControls?.get('cartorio')?.get('cidadeUf')?.setValue(cartorioPorCns.endereco.cidadeUf);
          }
          this.formControls?.get('contratante')?.get('id')?.setValue(contratoPeloCpf.contratante.id);
          this.formControls?.get('contratante')?.get('nome')?.setValue(contratoPeloCpf.contratante.nome);
          this.formControls?.get('contratante')?.get('cpf')?.setValue(contratoPeloCpf.contratante.cpf);
          this.formControls?.get('contratante')?.get('rg')?.setValue(contratoPeloCpf.contratante.rg);
          this.formControls?.get('contratante')?.get('email')?.setValue(contratoPeloCpf.contratante.email);
          this.formControls?.get('contratante')?.get('telefone')?.setValue(contratoPeloCpf.contratante.telefone);
          this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(contratoPeloCpf.contratante.nacionalidade);
          this.formControls?.get('contratante')?.get('profissao')?.setValue(contratoPeloCpf.contratante.profissao);
          this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(contratoPeloCpf.contratante.estadoCivil);

          this.findImovel()
        
        }
      }
    }
  }

  findImovel(){
    console.log()
    const imovelPeloContratanteId = this.databaseInfo.imoveis.find((item: any) => item.contratante.id ==  this.formControls?.get('contratante')?.get('id')?.value);
    if(this.databaseInfo.imoveis && imovelPeloContratanteId){
      this.imovelDoContratante = imovelPeloContratanteId;
      this.formControls?.get('contratante')?.get('imovelId')?.setValue(imovelPeloContratanteId.id);
      this.showDowloadContrato = true;
      console.log( this.imovelDoContratante);
      this.existeImovel = true;
    }else{
      this.showDowloadContrato = false;
      this.existeImovel = false;
      this.toolboxService.showTooltip('error', 'Não foi localizado o imovel deste contratante, favor registrar na tela Imovel para dar continuidade com o Contrato!', 'ERRO IMOVEL!');
    }
  }

  cadastrar() {
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.contratos){
      this.formControls?.get('id')?.setValue(Math.floor(Math.random() * 100000));

      this.databaseInfo.contratos.push(
       this.formControls.getRawValue()
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/contrato/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.contratos){
      const index = this.databaseInfo.contratos.findIndex((item: any) => item.id == this.contratoId);
      if (index !== -1) {
        this.databaseInfo.contratos[index] = this.formControls.getRawValue();
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/contrato/lista']);
    }
  }

  gerarMatricula(){
    this.formControls?.get('crf')?.get('numerocrf')?.setValue(Math.floor(Math.random() * 10000000));
    this.formControls?.get('crf')?.get('crfentregue')?.setValue("Entregue");
    this.formControls?.get('crf')?.get('statusentrega')?.setValue("Finalizado");
  }

  formularioValido(): boolean {
    return (
      this.formControls.valid
    );
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
  }

  handleKeyUpContratante(event: any) {
    clearTimeout(this.timeoutId); 
    const cpf = event.target.value.trim();
    if (cpf.length >= 3) {
      this.timeoutId = setTimeout(() => {
        this.buscarContratantes(cpf);
      }, 2000); 
    } else {

      this.filteredContratantes = [];
    }
  }
  
  buscarContratantes(cpf: string) {
    this.databaseInfo.contratantes.filter((item: any) => {
      if(item.cpf?.includes(cpf)){
         this.filteredContratantes.push(item);
      }  
    });
  }

  selectContratante(item: any){
    this.formControls?.get('cartorio')?.get('nome')?.setValue(item.cartorio.nome);
    this.formControls?.get('cartorio')?.get('cns')?.setValue(item.cartorio.cns);
    const cartorioPorCns = this.databaseInfo.cartorios.find((cartorio: any) => cartorio.cartorio.cns == this.formControls?.get('cartorio')?.get('cns')?.value);
    if(cartorioPorCns){
      this.formControls?.get('cartorio')?.get('cidadeUf')?.setValue(cartorioPorCns.endereco.cidadeUf);
    }

    this.formControls?.get('contratante')?.get('id')?.setValue(item.id);
    this.formControls?.get('contratante')?.get('nome')?.setValue(item.nome);
    this.formControls?.get('contratante')?.get('cpf')?.setValue(item.cpf);
    this.formControls?.get('contratante')?.get('rg')?.setValue(item.rg);
    this.formControls?.get('contratante')?.get('email')?.setValue(item.email);
    this.formControls?.get('contratante')?.get('telefone')?.setValue(item.telefone);
    this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(item.nacionalidade);
    this.formControls?.get('contratante')?.get('profissao')?.setValue(item.profissao);
    this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(item.estadoCivil);

    this.findImovel()
    this.filteredContratantes = [];
  }

  receiveDataFromChild(data: any) {
    this.parcelamentoInfo = data;
  }

  async generateWordFile(){
    console.log(this.formControls, this.imovelDoContratante, this.parcelamentoInfo)
    await this.wordService.generateWordContratoFile(this.formControls, this.imovelDoContratante, this.parcelamentoInfo);
  }
}
