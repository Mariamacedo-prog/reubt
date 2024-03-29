import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../toolbox/toolbox.service';


interface TypeSelectValue {
  value: number;
  quant: number;
  viewValue: string;
}



@Component({
  selector: 'app-pagamento-calculo',
  templateUrl: './pagamento-calculo.component.html',
  styleUrl: './pagamento-calculo.component.css'
})
export class PagamentoCalculoComponent {
  planos: TypeSelectValue[] = [
    {value: 6000, quant: 1, viewValue: 'Valor: R$6.000,00 - Por imóvel de habitação'},
    {value: 10000, quant: 1 ,viewValue: 'Valor: R$10.000,00 - Comercio'},
    {value: 12000, quant: 1 ,viewValue: 'Valor: R$12.000,00 - Indústria'},
  ];
  formControls!: FormGroup;
  optionsEntrada: TypeSelectValue[] = [];
  optionsParcelas: TypeSelectValue[] = [];
  minDate: Date = new Date();
  panelOpenState:boolean = false;
  databaseInfo: any = {};
  existeParcelamento:boolean = false;
  @Input() dataContratanteInfo: any;

  @Output() dataEvent = new EventEmitter<any>();

  constructor(private toolboxService: ToolboxService, private formBuilder: FormBuilder) {
  }

  entradaFormControls = this.formBuilder.group({
    quantidade: [0, Validators.required],
    valor: [0, Validators.required],
    dataPrimeiroPagamento: [null, Validators.required],
    dataUltimoPagamento: [null],
    valorTotal:[0]
  });

  parcelasFormControls = this.formBuilder.group({
    quantidade: [0, Validators.required],
    valor: [0, Validators.required],
    dataPrimeiroPagamento: [0, Validators.required],
    dataUltimoPagamento: [0],
    valorTotal:[0, Validators.required]
  });
  
  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id:[0],
      plano: [null, Validators.required],
      entrada: this.entradaFormControls,
      parcelas: this.parcelasFormControls,
      isAvista: false,
      valorAvista: [null, Validators.required],
    });

    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }

    let existByContratante = this.databaseInfo.vendasPagamentos.find((item: any) => item.contratante.id == this.dataContratanteInfo.id);
    
    if(this.databaseInfo && this.databaseInfo.vendasPagamentos && existByContratante){
      this.formControls?.get('plano')?.setValue(existByContratante.plano);
      this.registarValores();
      this.formControls?.get('id')?.setValue(existByContratante.id);
      this.formControls?.get('isAvista')?.setValue(existByContratante.isAvista);

      this.formControls?.get('valorAvista')?.setValue(existByContratante.valorAvista);


      this.formControls?.get('parcelas')?.get('quantidade')?.setValue(existByContratante?.parcelas?.quantidade);
      this.formControls?.get('parcelas')?.get('valor')?.setValue(existByContratante?.parcelas?.valor);
      this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(existByContratante?.parcelas?.dataPrimeiroPagamento);
      this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(existByContratante?.parcelas?.dataUltimoPagamento);
      this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(existByContratante?.parcelas?.valorTotal);
      
      this.formControls?.get('entrada')?.get('quantidade')?.setValue(existByContratante?.entrada?.quantidade);
      this.formControls?.get('entrada')?.get('valor')?.setValue(existByContratante?.entrada?.valor);
      this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(existByContratante?.entrada?.dataPrimeiroPagamento);
      this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(existByContratante?.entrada?.dataUltimoPagamento);
      this.formControls?.get('entrada')?.get('valorTotal')?.setValue(existByContratante?.entrada?.valorTotal);
     

      this.dataEvent.emit(this.formControls.getRawValue());
      this.existeParcelamento = true;
    }
  }

  changePlano(event: any) {
    this.listarValorEntrada();
    let value = event.value;
    if(value){
      this.optionsEntrada = [];
      this.formControls?.get('plano')?.setValue(value);
      const valorAvista = value - (value * 0.10);
  
      this.formControls?.get('valorAvista')?.setValue(valorAvista);
      this.listarValorEntrada();
    }
  }

  listarValorEntrada(){
    this.optionsEntrada = [];
    this.optionsParcelas = [];
    this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);

    const entrada = this.formControls?.get('plano')?.value * 0.10;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      value: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      value: novaEntrada ,
      quant:2,
      viewValue: `Em 2 vezes de R$${novaEntrada.toFixed(2)}`
     });
  }

  changeEntrada(event: any){
    this.optionsParcelas = [];
    this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
    this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
    
    const value = event?.value; // Acessa o valor selecionado do evento
    if(value){
        const entradaX = this.optionsEntrada.find(item => item.value === value);
        if(entradaX){
          this.formControls?.get('entrada')?.get('valor')?.setValue(entradaX.value);
          this.formControls?.get('entrada')?.get('quantidade')?.setValue(entradaX.quant);
          this.formControls?.get('entrada')?.get('valorTotal')?.setValue(entradaX.value * entradaX.quant);

          this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.setValue(null);
          this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
          this.listarValorParcela();
        }
    }
  }

  calculateDataFinalEntrada() {
    const quantidadeParcelas = this.formControls?.get('entrada')?.get('quantidade')?.value;
    const dataPrimeiroPagamento = this.formControls?.get('entrada')?.get('dataPrimeiroPagamento')?.value;
    if (quantidadeParcelas > 1 && dataPrimeiroPagamento) {
        const dataUltimoPagamento = new Date(dataPrimeiroPagamento);
        dataUltimoPagamento.setMonth(dataUltimoPagamento.getMonth() + 1);
        this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(dataUltimoPagamento);
    } else {
        this.formControls?.get('entrada')?.get('dataUltimoPagamento')?.setValue(null);
    }
  }

  listarValorParcela(){
    this.optionsParcelas = [];
    const totalParcela = this.formControls?.get('plano')?.value * 0.90;
    let novoTotalPacela = parseFloat(totalParcela.toFixed(2));

    for(let i = 1; i <= 30; i++){
      let valor = novoTotalPacela / i;
      this.optionsParcelas.push({
        value: valor,
        quant: i,
        viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
       });
    }
    
  }

  changeParcela(event: any){
    const value = event?.value; // Acessa o valor selecionado do evento
    if(value){
        const parcelax = this.optionsParcelas.find(item => item.value === value);
        if(parcelax){
          this.formControls?.get('parcelas')?.get('valor')?.setValue(parcelax.value);
          this.formControls?.get('parcelas')?.get('quantidade')?.setValue(parcelax.quant);
          this.formControls?.get('parcelas')?.get('valorTotal')?.setValue(parcelax.value * parcelax.quant);

          this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.setValue(null);
          this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
        }
    }
  }

  calculateDataFinalParcela() {
    const quantidadeParcelas = this.formControls?.get('parcelas')?.get('quantidade')?.value;
    const dataPrimeiroPagamento = this.formControls?.get('parcelas')?.get('dataPrimeiroPagamento')?.value;
    if (quantidadeParcelas > 1 && dataPrimeiroPagamento) {
        const dataUltimoPagamento = new Date(dataPrimeiroPagamento);
        dataUltimoPagamento.setMonth(dataUltimoPagamento.getMonth() + (this.formControls?.get('parcelas')?.get('quantidade')?.value - 1));
        this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(dataUltimoPagamento);
    } else {
        this.formControls?.get('parcelas')?.get('dataUltimoPagamento')?.setValue(null);
    }
  }

  formularioValido(): boolean {
    return this.formControls.valid;
  }

  gerarParcelamento(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }

    let existByContratante = this.databaseInfo.vendasPagamentos.filter((item: any) => item.contratante.id == this.dataContratanteInfo.id);
    this.formControls?.get('id')?.setValue(Math.floor(Math.random() * 100000));
    let item =  this.formControls.getRawValue();
    item.contratante = this.dataContratanteInfo;

    if(existByContratante.length == 0){
      this.databaseInfo.vendasPagamentos.push(
       item
      )
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Parcelamento realizado com sucesso!', 'Sucesso!');
    }

    this.dataEvent.emit(item);
  }

  atualizarParcelamento(){
    const storedDb = localStorage.getItem('appDb');
    if (storedDb) {
      this.databaseInfo = JSON.parse(storedDb);
    }

    let item =  this.formControls.getRawValue();
    item.contratante = this.dataContratanteInfo;

    const index = this.databaseInfo.vendasPagamentos.findIndex((item: any) => item.id ==  this.formControls.get('id')?.value);

    console.log( item, index)
    if (index !== -1) {
      this.databaseInfo.vendasPagamentos[index] = item;
      localStorage.setItem('appDb', JSON.stringify(this.databaseInfo));

      this.toolboxService.showTooltip('success', 'Parcelamento realizado com sucesso!', 'Sucesso!');
    }

    this.dataEvent.emit(item);
  }

  registarValores(){
    this.optionsEntrada = [];
    this.optionsParcelas = [];
    const entrada = this.formControls?.get('plano')?.value * 0.10;
    let novaEntrada = parseFloat(entrada.toFixed(2));
    

    this.optionsEntrada.push({
      value: novaEntrada,
      quant: 1,
      viewValue: `Em 1 vez de R$${novaEntrada.toFixed(2)}`
     });

     novaEntrada = novaEntrada / 2;

     this.optionsEntrada.push({
      value: novaEntrada ,
      quant:2,
      viewValue: `Em 2 vezes de R$${novaEntrada.toFixed(2)}`
     });
 
     const totalParcela = this.formControls?.get('plano')?.value * 0.90;
     let novoTotalPacela = parseFloat(totalParcela.toFixed(2));
 
     for(let i = 1; i <= 30; i++){
       let valor = novoTotalPacela / i;
       this.optionsParcelas.push({
         value: valor,
         quant: i,
         viewValue: `Em ${i} vez${i > 1 ? 'es' : ' '} de R$${valor.toFixed(2)}`
        });
     }
  }
}
