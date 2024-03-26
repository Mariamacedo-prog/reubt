import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-contratante-form',
  templateUrl: './contratante-form.component.html',
  styleUrl: './contratante-form.component.css'
})
export class ContratanteFormComponent {
  contratanteId = 0;
  isMarried = false;
  isLoggedIn: boolean = false;
  databaseInfo: any = {};
  estadoCivil: any = {};
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  visualizar: boolean = false;
  formControls!: FormGroup;

  
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private validateService: ValidateService,private formBuilder: FormBuilder) {}

  anexosFormControl = this.formBuilder.group({
    rgFile: [{base64: '',type: ''}, Validators.required],
    cpfFile: [{base64: '',type: ''}, Validators.required],
    comprovanteAquisicaoImovelFile: [{base64: '',type: ''}, Validators.required],
    comprovanteEnderecofile: [{base64: '',type: ''}, Validators.required],
    cetidaoCasamentoFile:[{base64: '',type: ''}],
    rgConjugueFile:[{base64: '',type: ''}],
    cpfConjugueFile:[{base64: '',type: ''}]
  });


  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, this.validateService.validateCPF]],
      rg: ['', [Validators.required, this.validateService.validateRG]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      nacionalidade: ['', [Validators.required]],
      profissao: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      nomeConjugue: [''],
      nacionalidadeConjugue: [''],
      anexos: this.anexosFormControl
    });

    this.route.params.subscribe(params => {
       this.contratanteId = params['id'];

       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
      console.log(this.databaseInfo )
      this.estadoCivil = this.databaseInfo.estadoCivil;
        if(this.contratanteId){
          if(this.databaseInfo.contratantes){
            const contratantePeloCpf = this.databaseInfo.contratantes.find((contratante: any) => contratante.id == this.contratanteId);
            if(contratantePeloCpf){
              this.formControls?.get('id')?.setValue(contratantePeloCpf.id);
              this.formControls?.get('nome')?.setValue(contratantePeloCpf.nome);
              this.formControls?.get('cpf')?.setValue(contratantePeloCpf.cpf);
              this.formControls?.get('rg')?.setValue(contratantePeloCpf.rg);
              this.formControls?.get('email')?.setValue(contratantePeloCpf.email);
              this.formControls?.get('telefone')?.setValue(contratantePeloCpf.telefone);
              this.formControls?.get('nacionalidade')?.setValue(contratantePeloCpf.nacionalidade);
              this.formControls?.get('profissao')?.setValue(contratantePeloCpf.profissao);
              this.formControls?.get('estadoCivil')?.setValue(contratantePeloCpf.estadoCivil);
              this.formControls?.get('nomeConjugue')?.setValue(contratantePeloCpf.nomeConjugue);
              this.formControls?.get('nacionalidadeConjugue')?.setValue(contratantePeloCpf.nacionalidadeConjugue);

              this.formControls.get('anexos')?.get('rgFile')?.setValue(contratantePeloCpf.anexos.rgFile);
              this.formControls.get('anexos')?.get('cpfFile')?.setValue(contratantePeloCpf.anexos.cpfFile);
              this.formControls.get('anexos')?.get('comprovanteAquisicaoImovelFile')?.setValue(contratantePeloCpf.anexos.comprovanteAquisicaoImovelFile);
              this.formControls.get('anexos')?.get('comprovanteEnderecofile')?.setValue(contratantePeloCpf.anexos.comprovanteEnderecofile);
              this.formControls.get('anexos')?.get('cetidaoCasamentoFile')?.setValue(contratantePeloCpf.anexos.cetidaoCasamentoFile);
              this.formControls.get('anexos')?.get('rgConjugueFile')?.setValue(contratantePeloCpf.anexos.rgConjugueFile);
              this.formControls.get('anexos')?.get('cpfConjugueFile')?.setValue(contratantePeloCpf.anexos.cpfConjugueFile);

              console.log('VALORES',this.formControls.getRawValue())
              console.log('ANEXOS',this.formControls.get('anexos')?.getRawValue())
              if(contratantePeloCpf.estadoCivil == 'Casado' || contratantePeloCpf.estadoCivil == 'União Estável'){
                this.isMarried = true;
              }
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
    if(this.databaseInfo.contratantes){
      const contratantePeloCpf = this.databaseInfo.contratantes.find((contratante: any) => contratante.cpf == this.formControls?.get('cpf')?.value);
      if(contratantePeloCpf){
        this.toolboxService.showTooltip('error', 'contratante com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const contratantePeloEmail = this.databaseInfo.contratantes.find((contratante: any) => contratante.email == this.formControls?.get('email')?.value);
      if(contratantePeloEmail){
        this.toolboxService.showTooltip('error', 'contratante com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      this.formControls?.get('id')?.setValue(Math.floor(Math.random() * 100000));

      this.databaseInfo.contratantes.push(
       this.formControls.getRawValue()
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/contratante/lista']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.contratantes){
      const contratantePeloCpf = this.databaseInfo.contratantes.find((contratante: any) => contratante.cpf == this.formControls?.get('cpf')?.value && contratante.id != this.contratanteId);
      if(contratantePeloCpf){
        this.toolboxService.showTooltip('error', 'contratante com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const contratantePeloEmail = this.databaseInfo.contratantes.find((contratante: any) => contratante.email == this.formControls?.get('email')?.value && contratante.id != this.contratanteId);
      if(contratantePeloEmail){
        this.toolboxService.showTooltip('error', 'contratante com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.contratantes.findIndex((item: any) => item.id == this.contratanteId);
      if (index !== -1) {
        this.databaseInfo.contratantes[index] = this.formControls.getRawValue();
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/contratante/lista']);
    }
  }

  selectEstadoCivil() {
    const estadoCivilAtual = this.formControls?.get('estadoCivil')?.value?.toString();
    
    if (estadoCivilAtual === 'Casado' || estadoCivilAtual === 'União Estável') {
      this.isMarried = true;
      this.formControls?.get('nomeConjugue')?.setValidators([Validators.required]);
      this.formControls?.get('nacionalidadeConjugue')?.setValidators([Validators.required]);
    } else {
      this.isMarried = false;
      this.formControls?.get('nomeConjugue')?.clearValidators();
      this.formControls?.get('nacionalidadeConjugue')?.clearValidators();
      this.formControls?.get('nomeConjugue')?.setValue("");
      this.formControls?.get('nacionalidadeConjugue')?.setValue("");
    }

    this.formControls?.get('nomeConjugue')?.updateValueAndValidity();
    this.formControls?.get('nacionalidadeConjugue')?.updateValueAndValidity();
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
  
  formatarTelefone() {
    if(this.formControls?.get('telefone')?.value){
      let telefone = this.formControls?.get('telefone')?.value.replace(/\D/g, '');

      if (telefone.length === 11) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`);
      } else if (telefone.length === 10) {
        this.formControls?.get('telefone')?.setValue(`(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`);
      }
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
    }
  }

  saveFileBase64(event: { base64: string, type: string }, fileName: string){
    this.anexosFormControl?.get(fileName)?.patchValue(event);
  }
}
