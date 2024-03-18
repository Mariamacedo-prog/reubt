import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private validateService: ValidateService) {}

  nomeFormControl = new FormControl('', Validators.required);
  cpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPF]);
  rgFormControl = new FormControl('', [Validators.required, this.validateService.validateRG]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);
  nacionalidadeFormControl = new FormControl('', [Validators.required]);
  profissaoFormControl = new FormControl('', [Validators.required]);
  estadoCivilFormControl = new FormControl('', [Validators.required]);
  nomeConjugueFormControl = new FormControl('');
  nacionalidadeConjugueFormControl = new FormControl('');



  ngOnInit(): void {
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
              this.nomeFormControl.setValue(contratantePeloCpf.nome);
              this.cpfFormControl.setValue(contratantePeloCpf.cpf);
              this.rgFormControl.setValue(contratantePeloCpf.rg);
              this.emailFormControl.setValue(contratantePeloCpf.email);
              this.telefoneFormControl.setValue(contratantePeloCpf.telefone);
              this.nacionalidadeFormControl.setValue(contratantePeloCpf.nacionalidade);
              this.profissaoFormControl.setValue(contratantePeloCpf.profissao);
              this.estadoCivilFormControl.setValue(contratantePeloCpf.estadoCivil);
              this.nomeConjugueFormControl.setValue(contratantePeloCpf.nomeConjugue);
              this.nacionalidadeConjugueFormControl.setValue(contratantePeloCpf.nacionalidadeConjugue);

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
      const contratantePeloCpf = this.databaseInfo.contratantes.find((contratante: any) => contratante.cpf == this.cpfFormControl.value);
      if(contratantePeloCpf){
        this.toolboxService.showTooltip('error', 'contratante com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const contratantePeloEmail = this.databaseInfo.contratantes.find((contratante: any) => contratante.email == this.emailFormControl.value);
      if(contratantePeloEmail){
        this.toolboxService.showTooltip('error', 'contratante com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      this.databaseInfo.contratantes.push(
        {
          id: Math.floor(Math.random() * 100000),
          nome: this.nomeFormControl.value,
          cpf: this.cpfFormControl.value,
          rg: this.rgFormControl.value,
          email: this.emailFormControl.value,
          telefone: this.telefoneFormControl.value,
          nacionalidade: this.nacionalidadeFormControl.value,
          profissao: this.profissaoFormControl.value,
          estadoCivil: this.estadoCivilFormControl.value,
          nomeConjugue: this.nomeConjugueFormControl.value,
          nacionalidadeConjugue: this.nacionalidadeConjugueFormControl.value
        }
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/lista/contratantes']);
    }
  }

  atualizar(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.contratantes){
      const contratantePeloCpf = this.databaseInfo.contratantes.find((contratante: any) => contratante.cpf == this.cpfFormControl.value && contratante.id != this.contratanteId);
      if(contratantePeloCpf){
        this.toolboxService.showTooltip('error', 'contratante com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const contratantePeloEmail = this.databaseInfo.contratantes.find((contratante: any) => contratante.email == this.emailFormControl.value && contratante.id != this.contratanteId);
      if(contratantePeloEmail){
        this.toolboxService.showTooltip('error', 'contratante com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.contratantes.findIndex((item: any) => item.id == this.contratanteId);
      if (index !== -1) {
        this.databaseInfo.contratantes[index] = {
          id: this.contratanteId,
          nome: this.nomeFormControl.value,
          cpf: this.cpfFormControl.value,
          rg: this.rgFormControl.value,
          email: this.emailFormControl.value,
          telefone: this.telefoneFormControl.value,
          nacionalidade: this.nacionalidadeFormControl.value,
          profissao: this.profissaoFormControl.value,
          estadoCivil: this.estadoCivilFormControl.value,
          nomeConjugue: this.nomeConjugueFormControl.value,
          nacionalidadeConjugue: this.nacionalidadeConjugueFormControl.value
        };
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro atualizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/lista/contratantes']);
    }
  }


  selectEstadoCivil() {
    const estadoCivilAtual = this.estadoCivilFormControl.value?.toString();
    
    if (estadoCivilAtual === 'Casado' || estadoCivilAtual === 'União Estável') {
      this.isMarried = true;
      this.nomeConjugueFormControl.setValidators([Validators.required]);
      this.nacionalidadeConjugueFormControl.setValidators([Validators.required]);
    } else {
      this.isMarried = false;
      this.nomeConjugueFormControl.clearValidators();
      this.nacionalidadeConjugueFormControl.clearValidators();
      this.nomeConjugueFormControl.setValue("");
      this.nacionalidadeConjugueFormControl.setValue("");
    }

    this.nomeConjugueFormControl.updateValueAndValidity();
    this.nacionalidadeConjugueFormControl.updateValueAndValidity();
  }

  formularioValido(): boolean {
    return (
      this.nomeFormControl.valid &&
      this.cpfFormControl.valid &&
      this.rgFormControl.valid &&
      this.emailFormControl.valid &&
      this.telefoneFormControl.valid &&
      this.nacionalidadeFormControl.valid &&
      this.profissaoFormControl.valid &&
      this.estadoCivilFormControl.valid &&
      this.nomeConjugueFormControl.valid &&
      this.nacionalidadeConjugueFormControl.valid
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Nome do arquivo:', file.name);
      console.log('Tamanho do arquivo:', file.size);
      // Faça o que precisar com o arquivo aqui, como enviá-lo para um servidor, etc.
    }
  }
}
