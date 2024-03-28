import { Component } from '@angular/core';
import { WordService } from '../../../services/word.service';
import { Document, Header, ImageRun, Paragraph, SymbolRun, TextRun } from "docx";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolboxService } from '../../../components/toolbox/toolbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateService } from '../../../services/validate.service';

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

  
  constructor(private toolboxService: ToolboxService, private router: Router, 
    private route: ActivatedRoute, private validateService: ValidateService,
    private formBuilder: FormBuilder, private wordService: WordService) {
    }

  cartorioFormControls = this.formBuilder.group({
    nome: ['', Validators.required],
    cns: ['', [Validators.required]],
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
    estadoCivil: ['', [Validators.required]]
  });

  empresaFormControls = this.formBuilder.group({
    nome:["", Validators.required],
    cnpj:["", Validators.required]
  });

  ngOnInit(): void {
    this.formControls = this.formBuilder.group({
      id: [0, Validators.required],
      contratante: this.contratanteFormControls,
      crf: this.crfFormControls,
      endereco: this.enderecoFormControls,
      cartorio: this.cartorioFormControls,
      empresa: this.empresaFormControls
    });
   
    this.route.params.subscribe(params => {
       this.contratoId = params['id'];

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

        this.formControls?.get('endereco')?.get('rua')?.setValue(empresa.endereco.rua);
        this.formControls?.get('endereco')?.get('numero')?.setValue(empresa.endereco.numero);
        this.formControls?.get('endereco')?.get('bairro')?.setValue(empresa.endereco.bairro);
        this.formControls?.get('endereco')?.get('complemento')?.setValue(empresa.endereco.complemento);
        this.formControls?.get('endereco')?.get('cidadeUf')?.setValue(empresa.endereco.cidadeUf);
      }
  
      if(this.contratoId){
        const contratoPeloCpf = this.databaseInfo.contratos.find((contrato: any) => contrato.id == this.contratoId);
        if(this.databaseInfo.contratos){
          this.formControls?.get('crf')?.get('numerocrf')?.setValue(contratoPeloCpf.crf.numerocrf);
          this.formControls?.get('crf')?.get('crfentregue')?.setValue(contratoPeloCpf.crf.crfentregue);
          this.formControls?.get('crf')?.get('statusentrega')?.setValue(contratoPeloCpf.crf.statusentrega);

          this.formControls?.get('cartorio')?.get('nome')?.setValue(contratoPeloCpf.cartorio.nome);
          this.formControls?.get('cartorio')?.get('cns')?.setValue(contratoPeloCpf.cartorio.cns);

          this.formControls?.get('contratante')?.get('id')?.setValue(contratoPeloCpf.contratante.id);
          this.formControls?.get('contratante')?.get('nome')?.setValue(contratoPeloCpf.contratante.nome);
          this.formControls?.get('contratante')?.get('cpf')?.setValue(contratoPeloCpf.contratante.cpf);
          this.formControls?.get('contratante')?.get('rg')?.setValue(contratoPeloCpf.contratante.rg);
          this.formControls?.get('contratante')?.get('email')?.setValue(contratoPeloCpf.contratante.email);
          this.formControls?.get('contratante')?.get('telefone')?.setValue(contratoPeloCpf.contratante.telefone);
          this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(contratoPeloCpf.contratante.nacionalidade);
          this.formControls?.get('contratante')?.get('profissao')?.setValue(contratoPeloCpf.contratante.profissao);
          this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(contratoPeloCpf.contratante.estadoCivil);
        }
      }
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

    this.formControls?.get('contratante')?.get('id')?.setValue(item.id);
    this.formControls?.get('contratante')?.get('nome')?.setValue(item.nome);
    this.formControls?.get('contratante')?.get('cpf')?.setValue(item.cpf);
    this.formControls?.get('contratante')?.get('rg')?.setValue(item.rg);
    this.formControls?.get('contratante')?.get('email')?.setValue(item.email);
    this.formControls?.get('contratante')?.get('telefone')?.setValue(item.telefone);
    this.formControls?.get('contratante')?.get('nacionalidade')?.setValue(item.nacionalidade);
    this.formControls?.get('contratante')?.get('profissao')?.setValue(item.profissao);
    this.formControls?.get('contratante')?.get('estadoCivil')?.setValue(item.estadoCivil);
    this.filteredContratantes = [];
  }

  gerarParagrafo(data: any, alignment: 
    "left" | "start" | "center" | "end" | "both" | "mediumKashida" | 
  "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute" | "right" | undefined = "left"){
    let textArrays:any = []

    for(let item of data){
      textArrays.push(new TextRun(item));
    }

    return new Paragraph({
      children: textArrays
      ,
      spacing: {
          line: 400
      },
      alignment: alignment
    })
  }

  async generateWordFile() {
    // Crie um objeto ImageRun com a URL da imagem
    const image = new ImageRun({
        data: await fetch('../../../../assets/logoLM.psd.png').then(response => response.arrayBuffer()),
        transformation: {
            width: 70,
            height: 70,
        }
    });
    // Crie um cabeçalho e adicione a imagem a ele
    const header = new Header({
      children: [new Paragraph({
        children: [image],
        alignment: "right"
      })]
    });

    const space = new Paragraph({
      children: [
        new TextRun(""),
    ]})

    const doc = new Document({
      sections: [
          {
              properties: {},
              headers: {default: header},
              children: [
                this.gerarParagrafo(
                 [ { text:"CONTRATO DE PRESTAÇÃO DE SERVIÇOS PARA INDIVIDUALIZAÇÃO DE UNIDADES", 
                    bold:true, 
                    size:31, 
                    font: "Arial"
                  }], "center"),
                space,
                space,  space,
                this.gerarParagrafo(
                  [{ text:"Pelo presente instrumento particular, as partes abaixo qualificadas", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  }]),
                space,  space,
                this.gerarParagrafo(
                  [ 
                   { text:'Contratante: ', 
                     bold:true, 
                     size:25, 
                     font: "Arial",
                     spacing: {
                       line: 360 // Ajuste o tamanho da linha para aumentar o espaçamento entre as linhas
                     }
                   },
                   { spacing: {
                       line: 360 // Ajuste o tamanho da linha para aumentar o espaçamento entre as linhas
                     },
                     text:`${this.formControls?.get('contratante')?.get('nome')?.value}, ${this.formControls?.get('contratante')?.get('nacionalidade')?.value}, ${this.formControls?.get('contratante')?.get('estadoCivil')?.value}, ${this.formControls?.get('contratante')?.get('profissao')?.value}, inscrito no CPF sob o n° ${this.formControls?.get('contratante')?.get('cpf')?.value} e no RG sob o n° ${this.formControls?.get('contratante')?.get('rg')?.value}, residente e domiciliado na ${this.formControls?.get('endereco')?.get('rua')?.value}, n ${this.formControls?.get('endereco')?.get('numero')?.value} ${this.formControls?.get('endereco')?.get('complemento')?.value}, ${this.formControls?.get('endereco')?.get('bairro')?.value}, ${this.formControls?.get('endereco')?.get('cep')?.value} ${this.formControls?.get('endereco')?.get('cidadeUf')?.value} doravante denominado `,
                     size:25, 
                     font: "Arial",
                     outlineLevel: 2,
                   },
                   { text:'CONTRATANTE. ', 
                   bold:true, 
                   size:25, 
                   font: "Arial",
                   spacing: {
                     line: 360 // Ajuste o tamanho da linha para aumentar o espaçamento entre as linhas
                   }
                 },
                 ]),
                space,  space,
                this.gerarParagrafo([ 
                  { text:'Contratada: ', 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { 
                    text:`${this.formControls?.get('empresa')?.get('nome')?.value}, pessoa jurídica de direito privado, inscrita no CNPJ sob o n° ${this.formControls?.get('empresa')?.get('cnpj')?.value}, com sede na ${this.formControls?.get('endereco')?.get('rua')?.value}, n ${this.formControls?.get('endereco')?.get('numero')?.value} ${this.formControls?.get('endereco')?.get('complemento')?.value}, ${this.formControls?.get('endereco')?.get('bairro')?.value}, ${this.formControls?.get('endereco')?.get('cidadeUf')?.value}, representada nesse ato por seu sócio administrador Claudemy Pereira da Silva, brasileiro, divorciado, empresário, residente e domiciliado na cidade de São Paulo – SP, cadastro no CPF/MF sob o nº040.237.058-96, e no RG. Sob o nº14.862.742-0, doravante denominada `,
                    size:25, 
                    font: "Arial",
                    outlineLevel: 2,
                  },
                  { text:'CONTRATANTE. ', 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                ]),
                space,  space,
                this.gerarParagrafo(
                  [{ text:"Considerando: ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                  [{ text:"        • A Lei n° 13.465/2017, que dispõe sobre a regularização fundiária urbana e rural;", 
                    size:25, 
                    font: "Arial"
                  }]),
                this.gerarParagrafo(
                  [{ text:"        • O interesse do ", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"CONTRATANTE ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"em individualizar a(s) unidade(s) de sua propriedade, situada(s) no [Endereço da porta do Imóvel];", 
                    size:25, 
                    font: "Arial"
                  }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • A experiência e expertise da CONTRATADA na prestação de serviços de individualização de unidades.", 
                    size:25, 
                    font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Celebram o presente Contrato de Prestação de Serviços para Individualização de Unidades, que se regerá pelas cláusulas e condições seguintes:", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 1ª - Do Objeto", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo([ 
                  { text:'A ', 
                    size:25, 
                    font: "Arial"
                  },
                  { text:'CONTRATADA ', 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"se obriga a prestar ao ",
                    size:25, 
                    font: "Arial",
                  },
                  { text:'CONTRATANTE ', 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:' os serviços de individualização da(s) unidade(s) de sua propriedade, situada(s) no [Endereço Completo do Imóvel], em conformidade com a Lei n° 13.465/2017 (REURB) ', 
                    size:25, 
                    font: "Arial"
                  },
                ]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 2ª - Dos Serviços", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                  [{ text:"Os serviços a serem prestados pela ", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"CONTRATADA ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"compreendem: ", 
                    size:25, 
                    font: "Arial"
                  }
                ]),
                space,  space,
                this.gerarParagrafo(
                  [{ text:"        • Elaboração de projeto técnico de individualização das unidades;", 
                    size:25, 
                    font: "Arial"
                  }]),
                this.gerarParagrafo(
                  [{ text:"        • Obtenção de todas as licenças e autorizações necessárias junto aos órgãos públicos competentes;", 
                    size:25, 
                    font: "Arial"
                  }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • Execução das obras de individualização das unidades;", 
                    size:25, 
                    font: "Arial"
                }]),
                this.gerarParagrafo(
                  [{ text:"        • Acompanhamento e assistência técnica durante todo o processo de individualização.", 
                    size:25, 
                    font: "Arial"
                }]),
                space, space,
                this.gerarParagrafo(
                [{ text:"Cláusula 3ª - Do Prazo", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                this.gerarParagrafo(
                  [{ text:"O prazo para a execução dos serviços será de ", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"[Número] ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"dias contados a partir da assinatura deste contrato.", 
                    size:25, 
                    font: "Arial"
                  }
                ]),

                space, space,
                this.gerarParagrafo(
                [{ text:"Cláusula 4ª - Do Valor", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                this.gerarParagrafo(
                  [{ text:"O valor total dos serviços a serem prestados pela ", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"CONTRATADA ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"é de ", 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"R$ [Valor Total] ", 
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"(reais), a ser pago da seguinte forma: ", 
                    size:25, 
                    font: "Arial"
                  }
                ]),
                space, space,
                this.gerarParagrafo(
                  [{ text:"        • 10% (dez por cento) de entrada, ",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:"divididos em até ",
                    size:25, 
                    font: "Arial"
                  },
                  { text:"2 (duas) ",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:"vezes, com vencimento das parcelas nos dias ",
                    size:25, 
                    font: "Arial"
                  },
                  { text:"[Datas de Vencimento das Parcelas da Entrada]. ",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • O restante, equivalente a 90% (noventa por cento), ",
                      bold:true,
                      size:25, 
                      font: "Arial"
                    },
                    { text:"poderá será dividido em até ",
                      size:25, 
                      font: "Arial"
                    },
                    { text:"30 (trinta) ",
                      bold:true,
                      size:25, 
                      font: "Arial"
                    },
                    { text:"parcelas mensais e iguais, com vencimento no dia ",
                      size:25, 
                      font: "Arial"
                    },
                    { text:"[Data de Vencimento das Parcelas Mensais] ",
                      bold:true,
                      size:25, 
                      font: "Arial"
                    },
                    { text:"de cada mês. ",
                      size:25, 
                      font: "Arial"
                    }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • Quantidade de parcelas proposta pelo CONTRATANTE [0000];",
                    bold:true,
                    size:25, 
                    font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 5ª - Da Forma de Pagamento", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"O pagamento das parcelas poderá ser feito através de boleto bancário, cartão de crédito, débito ou PIX.",  
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 6ª - Dos Reajustes", 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Os valores das parcelas mensais serão reajustados anualmente, pela variação do ",  
                  size:25, 
                  font: "Arial"
                },{
                  text:"IGP-M [Índice de Reajuste]. ",  
                  size:25, 
                  font: "Arial",
                  bold:true
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 7ª - Da Inadimplência",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Em caso de inadimplência do ",  
                  size:25, 
                  font: "Arial"
                },{
                  text:"CONTRATANTE ",  
                  size:25, 
                  font: "Arial",
                  bold:true
                },
                {
                  text:"a ",  
                  size:25, 
                  font: "Arial"
                },
                {
                  text:"CONTRATADA ",  
                  size:25, 
                  font: "Arial",
                  bold:true
                },
                {
                  text:"poderá: ",  
                  size:25, 
                  font: "Arial"
                }
                ]),
                space,  space,
                this.gerarParagrafo(
                  [{ text:"        • Cobrar juros de mora de ",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  },
                  { text:"1% (um por cento) ",
                    size:25,
                    bold:true,
                    font: "Arial"
                  },
                  { text:"ao mês; ",
                    size:25, 
                    font: "Arial"
                  }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • Suspender a prestação dos serviços; ",
                      size:25, 
                      font: "Arial"
                    }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • Rescindir o contrato.",
                    size:25, 
                    font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 8ª - Da Rescisão",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,  space,
                this.gerarParagrafo(
                [
                  { text:"O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação por escrito com antecedência mínima de ",  
                    size:25, 
                    font: "Arial"
                  },
                  { text:"30 (trinta) ",  
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  },
                  { text:"dias.",  
                    size:25, 
                    font: "Arial"
                  },
                ]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"Cláusula 9ª - Disposições Gerais",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                this.gerarParagrafo(
                  [{ text:"        • O presente contrato é celebrado em caráter irrevogável e irretratável; ",
                    bold:true,
                    size:25, 
                    font: "Arial"
                  }
                ]),
                this.gerarParagrafo(
                  [{ text:"        • As partes elegem o Foro da Comarca de [Cidade] para dirimir qualquer litígio que possa surgir em decorrência deste contrato. ",
                      size:25, 
                      font: "Arial"
                    }
                ]),
                space,  space,
                this.gerarParagrafo(
                [{ text:"E, por estarem assim justos e acordados, assinam o presente contrato em duas vias de igual teor e forma, na presença de duas testemunhas.",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                this.gerarParagrafo(
                [{ text:"[Local e Data]",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,

                space, space,
                this.gerarParagrafo(
                [{ text:"_____________________________________________",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,
                this.gerarParagrafo(
                [{ text:"CONTRATANTE",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                space, space,
                space, space,
                this.gerarParagrafo(
                [{ text:"_____________________________________________",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,
                this.gerarParagrafo(
                [{ text:"CONTRATADA",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                space, space,
                this.gerarParagrafo(
                  [{ text:"Testemunhas: ",  
                    bold:true, 
                    size:25, 
                    font: "Arial"
                  }]),
                  space, space, space, space,
                this.gerarParagrafo(
                [{ text:"1.___________________________________________",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space,    space,    space,  
                this.gerarParagrafo(
                [{ text:"2.___________________________________________",  
                  bold:true, 
                  size:25, 
                  font: "Arial"
                }]),
                space, space,
                
              ]
              
          },
      ]
  });

    this.wordService.generateWord(doc);
  }
}
