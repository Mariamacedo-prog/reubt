import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ValidateService } from '../../../services/validate.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {

  constructor(private toolboxService: ToolboxService, private router: Router, private route: ActivatedRoute,
    private validateService: ValidateService
    ) {}

  userId = 0;
  visualizar: boolean = false;
  isLoggedIn: boolean = false;
  confirmSenha: string = '';
  databaseInfo: any = {};

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nomeFormControl = new FormControl('', Validators.required);
  telefoneFormControl = new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]);
  loginCpfFormControl = new FormControl('', [Validators.required, this.validateService.validateCPF]);
  senhaFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]);
  confirmSenhaFormControl = new FormControl('', [Validators.required, this.compararSenhas.bind(this)]);



  ngOnInit(): void {
    this.route.params.subscribe(params => {
       this.userId = params['id'];
       
       if(params['tela'] == 'visualizar'){
        this.visualizar = true;
       }
    });

    this.isAuthenticated();

    if(this.userId){
      const storedDb = localStorage.getItem('appDb');
      if (storedDb) {
        this.databaseInfo = JSON.parse(storedDb);
        if(this.databaseInfo.usuarios ){
          const usuarioPeloCpf = this.databaseInfo.usuarios.find((usuario: any) => usuario.id == this.userId);
          if(usuarioPeloCpf){
            this.emailFormControl.setValue(usuarioPeloCpf.email);
            this.nomeFormControl.setValue(usuarioPeloCpf.nome);
            this.telefoneFormControl.setValue(usuarioPeloCpf.telefone);
            this.loginCpfFormControl.setValue(usuarioPeloCpf.cpf);
            this.senhaFormControl.setValue(usuarioPeloCpf.senha);
            this.confirmSenhaFormControl.setValue(usuarioPeloCpf.senha);
          }
        }
      }
    }
  }

  validateCPF(control: FormControl): { [key: string]: any } | null {
    const cpf = control.value?.replace(/[^\d]/g, '');

    if (!cpf || cpf.length !== 11) {
      return { 'cpfInvalido': true };
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return { 'cpfInvalido': true };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit = remainder >= 10 ? 0 : remainder;

    if (parseInt(cpf.charAt(9)) !== digit) {
      return { 'cpfInvalido': true };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    digit = remainder >= 10 ? 0 : remainder;

    if (parseInt(cpf.charAt(10)) !== digit) {
      return { 'cpfInvalido': true };
    }

    return null;
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

  compararSenhas(control: FormControl): { [key: string]: any } | null {
    const confirmSenha = control.value;
    const senha = this.senhaFormControl.value;

    if (senha && confirmSenha && senha !== confirmSenha) {
      return { 'senhasDivergentes': true };
    }

    return null;
  }

  isAuthenticated(){
    if(localStorage.getItem('isLoggedIn') == 'true'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }

  }

  cadastrar() {
    if(this.confirmSenhaFormControl.value != this.senhaFormControl.value){
      this.toolboxService.showTooltip('error', 'Senhas divergentes!', 'ERRO!');
    }
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    if(this.databaseInfo.usuarios){
      const usuarioPeloCpf = this.databaseInfo.usuarios.find((usuario: any) => usuario.cpf == this.loginCpfFormControl.value);
      if(usuarioPeloCpf){
        this.toolboxService.showTooltip('error', 'Usuário com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const usuarioPeloEmail = this.databaseInfo.usuarios.find((usuario: any) => usuario.email == this.emailFormControl.value);
      if(usuarioPeloEmail){
        this.toolboxService.showTooltip('error', 'Usuário com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      this.databaseInfo.usuarios.push(
        {
          "id": Math.floor(Math.random() * 10000),
          "email":this.emailFormControl.value,
          "senha": this.senhaFormControl.value,
          "nome": this.nomeFormControl.value,
          "telefone": this.telefoneFormControl.value,
          "cpf":this.loginCpfFormControl.value
        }
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      if(this.isLoggedIn){
        this.router.navigate(['/usuario/lista']);
      }else{
        this.router.navigate(['/login']);
      }

    }
  }

  atualizar(){
    if(this.confirmSenhaFormControl.value != this.senhaFormControl.value){
      this.toolboxService.showTooltip('error', 'Senhas divergentes!', 'ERRO!');
    }

    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }
    
    if(this.databaseInfo.usuarios){
      const usuarioPeloCpf = this.databaseInfo.usuarios.find((usuario: any) => usuario.cpf == this.loginCpfFormControl.value && usuario.id != this.userId);
      if(usuarioPeloCpf){
        this.toolboxService.showTooltip('error', 'Usuário com CPF já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const usuarioPeloEmail = this.databaseInfo.usuarios.find((usuario: any) => usuario.email == this.emailFormControl.value && usuario.id != this.userId);
      if(usuarioPeloEmail){
        this.toolboxService.showTooltip('error', 'Usuário com E-mail já existe na base de dados!', 'ERRO CPF!');
        return;
      }

      const index = this.databaseInfo.usuarios.findIndex((item: any) => item.id == this.userId);
      if (index !== -1) {
        this.databaseInfo.usuarios[index] = {
          "id": this.userId,
          "email":this.emailFormControl.value,
          "senha": this.senhaFormControl.value,
          "nome": this.nomeFormControl.value,
          "telefone": this.telefoneFormControl.value,
          "cpf":this.loginCpfFormControl.value
        };
      }

      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Cadastro realizado com sucesso!', 'Sucesso!');
      this.router.navigate(['/usuario/lista']);
    }
  }

  formularioValido(): boolean {
    return (
        this.nomeFormControl.valid &&
        this.emailFormControl.valid &&
        this.telefoneFormControl.valid &&
        this.loginCpfFormControl.valid &&
        this.senhaFormControl.valid &&
        this.confirmSenhaFormControl.valid
    );
  }
}
