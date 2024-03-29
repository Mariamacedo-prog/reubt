import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun , Header, ImageRun} from 'docx';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  constructor() { }
  
  generateWord(doc: Document, nome: any): void {
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if(nome){
        a.download = `${nome}.docx`;
      }else{
        a.download = 'contrato_REURB.docx';
      }

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
  getDocumentBlob(doc: Document): Promise<string> {
    return new Promise((resolve, reject) => {
      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }).catch(error => {
        reject(error);
      });
    });
  }
  obterDataHoraAtual() {
    const dataAtual = new Date();
  
    // Obtenha o dia, mês e ano
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Os meses começam do zero
    const ano = dataAtual.getFullYear();
  
    // Obtenha a hora, minutos e segundos
    const hora = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    
    // Formate a data e hora no formato desejado
    const dataHoraFormatada = `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  
    return dataHoraFormatada;
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

  transform(numero: number): string {
     const numerosPorExtenso = [
        'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
        'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove',
        'vinte', 'vinte e um', 'vinte e dois', 'vinte e três', 'vinte e quatro', 'vinte e cinco',
        'vinte e seis', 'vinte e sete', 'vinte e oito', 'vinte e nove', 'trinta'
    ];

    if (numero < 1 || numero > 30) {
        return '';
    }

    return numerosPorExtenso[numero];
  }

  formatarData(dataString: any) {
    const data = new Date(dataString);
    const dia = data.getUTCDate().toString().padStart(2, '0');
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = data.getUTCFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  }

  verificarDado(dataString: any): string{
    if(dataString != undefined && dataString != null){
      return dataString;
    }else{
      return '';
    }
  }

async generateWordContratoFile(formControls: FormGroup,  imovelDoContratante: any, parcelamentoInfo: any) {
    console.log(formControls,  imovelDoContratante, parcelamentoInfo);
    const image = new ImageRun({
        data: await fetch('../../../../assets/logoLM.psd.png').then(response => response.arrayBuffer()),
        transformation: {
            width: 70,
            height: 70,
        }
    });

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
                   
                 },
                 { 
                   text:`${formControls?.get('contratante')?.get('nome')?.value}, ${formControls?.get('contratante')?.get('nacionalidade')?.value}, ${formControls?.get('contratante')?.get('estadoCivil')?.value}, ${formControls?.get('contratante')?.get('profissao')?.value}, inscrito no CPF sob o n° ${formControls?.get('contratante')?.get('cpf')?.value} e no RG sob o n° ${formControls?.get('contratante')?.get('rg')?.value}, residente e domiciliado na ${formControls?.get('empresa')?.get('endereco')?.get('rua')?.value}, n ${formControls?.get('empresa')?.get('endereco')?.get('numero')?.value} ${formControls?.get('empresa')?.get('endereco')?.get('complemento')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('bairro')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.value} doravante denominado `,
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
              this.gerarParagrafo([ 
                { text:'Contratada: ', 
                  bold:true, 
                  size:25, 
                  font: "Arial"
                },
                { 
                  text:`${formControls?.get('empresa')?.get('nome')?.value}, pessoa jurídica de direito privado, inscrita no CNPJ sob o n° ${formControls?.get('empresa')?.get('cnpj')?.value}, com sede na ${formControls?.get('empresa')?.get('endereco')?.get('rua')?.value}, n ${formControls?.get('empresa')?.get('endereco')?.get('numero')?.value} ${formControls?.get('empresa')?.get('endereco')?.get('complemento')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('bairro')?.value}, ${formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.value}, representada nesse ato por seu sócio administrador Claudemy Pereira da Silva, brasileiro, divorciado, empresário, residente e domiciliado na cidade de São Paulo – SP, cadastro no CPF/MF sob o nº040.237.058-96, e no RG. Sob o nº14.862.742-0, doravante denominada `,
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
              { text:"em individualizar a(s) unidade(s) de sua propriedade, situada(s) no " + imovelDoContratante?.enderecoPorta ? `${imovelDoContratante?.enderecoPorta?.rua}, n ${imovelDoContratante?.enderecoPorta?.numero} ${imovelDoContratante?.enderecoPorta?.complemento}, ${imovelDoContratante?.enderecoPorta?.bairro}, ${imovelDoContratante?.enderecoPorta?.cidadeUf}` : "" + " ;", 
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
                { text:" os serviços de individualização da(s) unidade(s) de sua propriedade, situada(s) no  " + imovelDoContratante?.enderecoDefinitivo ? `${imovelDoContratante?.enderecoDefinitivo?.rua}, n ${imovelDoContratante?.enderecoDefinitivo?.numero} ${imovelDoContratante?.enderecoDefinitivo?.complemento}, ${imovelDoContratante?.enderecoDefinitivo?.bairro}, ${imovelDoContratante?.enderecoDefinitivo?.cidadeUf}` : "" + " ;"+" em conformidade com a Lei n° 13.465/2017 (REURB) ", 
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
                { text:"120 ", 
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
                { text: `${parcelamentoInfo?.plano?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 
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
                { text:`${this.formatarData(parcelamentoInfo?.entrada?.dataPrimeiroPagamento)} `,
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
                  { text:`${this.formatarData(parcelamentoInfo?.parcelas?.dataPrimeiroPagamento)} `,
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
                [{ text:parcelamentoInfo?.parcelas?.quantidade > 0 
                  ? `        • Quantidade de parcelas proposta pelo CONTRATANTE ${parcelamentoInfo?.parcelas?.quantidade} (${this.transform(parcelamentoInfo?.parcelas?.quantidade)});` 
                  : `        • Quantidade proposta pelo CONTRATANTE, 1 (${this.transform(1)}) pagamento à vista de ${parcelamentoInfo?.valorAvista?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
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
              [{ text:"Os valores das parcelas mensais serão reajustados mensalmente, com a correção da variação do  ",  
                size:25, 
                font: "Arial"
              },{
                text:"IPCA e juros de 0,5% (zero virgula cinco por cento). ",  
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
                [{ text:`        • As partes elegem o Foro da Comarca de ${formControls?.get('cartorio')?.get('cidadeUf')?.value} para dirimir qualquer litígio que possa surgir em decorrência deste contrato. `,
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
              [{ text: formControls?.get('empresa')?.get('endereco')?.get('cidadeUf')?.value + " " + this.obterDataHoraAtual(),  
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

  this.generateWord(doc, formControls?.get('contratante')?.get('nome')?.value);
}
}
