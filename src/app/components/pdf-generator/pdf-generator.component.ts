import {Component, Input} from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {IOrder} from "../../interfaces/IOrder";
import {OrderService} from "../../services/order.service";
import {IProduct} from "../../interfaces/IProduct";
import {CustomerService} from "../../services/customer.service";
import {DomSanitizer} from "@angular/platform-browser";
import * as moment from 'moment'
import {PDFDocument} from 'pdf-lib';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-generator',
  template: `
    <button mat-icon-button style="z-index: 99" (click)="loadLogoToBase64()"
            matTooltip="Stampa ordine">
      <mat-icon>print</mat-icon>
    </button>
  `,
})
export class PdfGeneratorComponent {
  @Input() orderInfo!: { order: IOrder, otherInfo: any };
  logoBase64!: string;


  constructor(private orderService: OrderService, private customerService: CustomerService, private sanitizer: DomSanitizer) {
  }

  loadInfoOrder() {
    this.orderService.getOrderById(this.orderInfo.order.id!).subscribe(order => {
      this.customerService.getCustomerById(order.idCustomer).subscribe(customer => {
        this.orderInfo.order.cliente = JSON.parse(JSON.stringify(customer));
        this.orderInfo.order.productList = JSON.parse(JSON.stringify(order.productList));
        this.getTotalPage(this.orderInfo);
      });
    });
  }

  getTotalPage(orderInfo: { order: IOrder, otherInfo: any }) {
    // Creare pdf temporaneo per recuperare pagine totali
    // Definire le opzioni del documento temporaneo con solo il footer
    const tmpDocumentDefinition = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30],
      fontSize: 12,
      content: [
        {
          columns: [
            {
              stack: [
                {
                  image: this.logoBase64,
                  width: 80,
                  height: 80,
                },
                {text: ''},
                {text: 'Nome Azienda'},
                {text: 'Via indirizzo azienda'},
                {text: 'CAP + PAESE + CITTA'},

                // Aggiungi le informazioni aggiuntive qui
              ],
              width: '50%', // Larghezza del 50%
            },
            {
              stack: [
                {
                  text: 'Proposta ordine',
                  fontSize: 16,
                  bold: true,
                  alignment: 'right',
                  margin: [0, 0, 0, 10],
                },
                {
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          stack: [
                            {text: 'Cliente', bold: true},
                            {text: orderInfo.order.cliente?.ragioneSociale},
                            {text: orderInfo.order.cliente?.indirizzo},
                            {text: orderInfo.order.cliente?.cap + ' ' + orderInfo.order.cliente?.localita + ' (' + orderInfo.order.cliente?.provincia + ')'},
                          ],
                          margin: [5, 10],
                          border: [true, true, true, true],
                          borderRadius: 5,
                        },
                      ],
                      [
                        {
                          stack: [
                            {text: 'Spedizione', bold: true},
                            {text: orderInfo.order.cliente?.ragioneSociale},
                            {text: orderInfo.order.cliente?.destinazioneMerce.indirizzo},
                            {text: orderInfo.order.cliente?.destinazioneMerce.cap + ' ' + orderInfo.order.cliente?.destinazioneMerce.localita + ' (' + orderInfo.order.cliente?.destinazioneMerce.provincia + ')'},
                          ],
                          margin: [5, 10],
                          border: [true, true, true, true],
                          borderRadius: 5,
                        },
                      ],
                    ],
                  },
                },
              ],
              width: '50%', // Larghezza del 50%
            },
          ],
          columnGap: 10,
        },
        {
          columns: [
            [
              {
                text: `Data ordine: ${moment(this.orderInfo.order.date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}`,
                alignment: 'left'
              },
              {
                text: `N° Ordine : ${this.orderInfo.order.id}`,
                alignment: 'left'
              },
              {
                text: `Modalità pagamento : ${this.orderInfo.order.descPaymentMethods}`,
                alignment: 'left'
              },
              {
                text: `Consegna : ${this.orderInfo.order.descDelivery}`,
                alignment: 'left'
              },
              {
                text: `Stagione : ${this.orderInfo.order.descSeason}`,
                alignment: 'left'
              }
            ]
          ]
        },
        {text: ' ', margin: [0, 0]}, // Testo vuoto con margine superiore di 10
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*', 'auto', 60, 60],
            body: [
              [{text: 'Foto', alignment: 'center', bold: true},
                {text: 'Codice', alignment: 'center', bold: true},
                {text: 'Descrizione', alignment: 'center', bold: true},
                {text: 'Dettaglio', alignment: 'center', bold: true},
                {text: 'Qta', alignment: 'center', bold: true},
                {text: 'Prezzo', alignment: 'center', bold: true},
                {text: 'Totale', alignment: 'center', bold: true}],
              ...orderInfo.order.productList.map(p => ([
                'RISOLVO ALLA FINE', p.productCode, p.productDesc, this.getDettaglioStack(p), this.getQuantityForProduct(p), this.formatPrice(p.price!), this.formatPrice(+p.price! * this.getQuantityForProduct(p))
                // p.image, p.productCode, p.productDesc, 'test', this.getQuantityForProduct(p), p.price, (+p.price! * this.getQuantityForProduct(p)).toFixed(2)
              ])),
              [{
                text: 'Prezzo Totale',
                colSpan: 6
              }, {}, {}, {}, {}, {}, this.formatPrice(orderInfo.order.productList.reduce((sum, p) => sum + (this.getQuantityForProduct(p) * +p.price!), 0))]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: 'Altre info',
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            // [{qr: `${orderInfo.order.user?.name}`, fit: '50'}],
            [{text: `Altre informazioni se vogliamo`, fit: '50'}],
            [{text: 'Firma se serve', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Termini e condizioni',
          style: 'sectionHeader'
        },
        {
          ul: [
            'L\'ordine può essere cancellato o modificato entro 7 giorni al massimo.',
            'La garanzia del prodotto sarà soggetta ai termini e alle condizioni del produttore.'
          ],
        }
      ],
      footer: (currentPage: number) => {
        return {
          text: `${currentPage}`,
          alignment: 'center',
          margin: [0, 10]
        };
      },
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    // Generare il documento temporaneo per ottenere le informazioni
    const tempPdfDocument = pdfMake.createPdf(tmpDocumentDefinition);

    // Generare il blob del documento temporaneo
    tempPdfDocument.getBlob(async (tempBlob: Blob) => {
      // Caricare il blob in pdf-lib
      const tempPdfBytes = await tempBlob.arrayBuffer();
      const tempPdfDoc = await PDFDocument.load(tempPdfBytes);

      // Ottenere il numero totale di pagine
      const totalPages = tempPdfDoc.getPageCount();

      this.generatePDF(this.orderInfo, totalPages);
    });
  }

  generatePDF(orderInfo: { order: IOrder, otherInfo: any }, totalPages: number) {
    if (orderInfo && orderInfo.order && orderInfo.order.cliente && orderInfo.order.productList) {
      /*
      orderInfo.order.productList = orderInfo.order.productList.map(p => {
        const base64Image = this.convertImageToBase64(p.image!); // Funzione da implementare
        return {...p, base64Image};
      });
       */
      // Creo pdf temporaneo per recupera pagine totali
      const documentDefinition = {
        pageOrientation: 'portrait',
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        fontSize: 12,
        content: [
          {
            columns: [
              {
                stack: [
                  {
                    image: this.logoBase64,
                    width: 80,
                    height: 80,
                  },
                  {text: ''},
                  {text: 'Nome Azienda'},
                  {text: 'Via indirizzo azienda'},
                  {text: 'CAP + PAESE + CITTA'},

                  // Aggiungi le informazioni aggiuntive qui
                ],
                width: '50%', // Larghezza del 50%
              },
              {
                stack: [
                  {
                    text: 'Proposta ordine',
                    fontSize: 16,
                    bold: true,
                    alignment: 'right',
                    margin: [0, 0, 0, 10],
                  },
                  {
                    table: {
                      widths: ['*'],
                      body: [
                        [
                          {
                            stack: [
                              {text: 'Cliente', bold: true},
                              {text: orderInfo.order.cliente?.ragioneSociale},
                              {text: orderInfo.order.cliente?.indirizzo},
                              {text: orderInfo.order.cliente?.cap + ' ' + orderInfo.order.cliente?.localita + ' (' + orderInfo.order.cliente?.provincia + ')'},
                            ],
                            margin: [5, 10],
                            border: [true, true, true, true],
                            borderRadius: 5,
                          },
                        ],
                        [
                          {
                            stack: [
                              {text: 'Spedizione', bold: true},
                              {text: orderInfo.order.cliente?.ragioneSociale},
                              {text: orderInfo.order.cliente?.destinazioneMerce.indirizzo},
                              {text: orderInfo.order.cliente?.destinazioneMerce.cap + ' ' + orderInfo.order.cliente?.destinazioneMerce.localita + ' (' + orderInfo.order.cliente?.destinazioneMerce.provincia + ')'},
                            ],
                            margin: [5, 10],
                            border: [true, true, true, true],
                            borderRadius: 5,
                          },
                        ],
                      ],
                    },
                  },
                ],
                width: '50%', // Larghezza del 50%
              },
            ],
            columnGap: 10,
          },
          {
            columns: [
              [
                {
                  text: `Data ordine: ${moment(this.orderInfo.order.date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}`,
                  alignment: 'left'
                },
                {
                  text: `N° Ordine : ${this.orderInfo.order.id}`,
                  alignment: 'left'
                },
                {
                  text: `Modalità pagamento : ${this.orderInfo.order.descPaymentMethods}`,
                  alignment: 'left'
                },
                {
                  text: `Consegna : ${this.orderInfo.order.descDelivery}`,
                  alignment: 'left'
                },
                {
                  text: `Stagione : ${this.orderInfo.order.descSeason}`,
                  alignment: 'left'
                }
              ]
            ]
          },
          {text: ' ', margin: [0, 0]}, // Testo vuoto con margine superiore di 10
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', '*', 'auto', 60, 60],
              body: [
                [{text: 'Foto', alignment: 'center', bold: true},
                  {text: 'Codice', alignment: 'center', bold: true},
                  {text: 'Descrizione', alignment: 'center', bold: true},
                  {text: 'Dettaglio', alignment: 'center', bold: true},
                  {text: 'Qta', alignment: 'center', bold: true},
                  {text: 'Prezzo', alignment: 'center', bold: true},
                  {text: 'Totale', alignment: 'center', bold: true}],
                ...orderInfo.order.productList.map(p => ([
                  'RISOLVO ALLA FINE', p.productCode, p.productDesc, this.getDettaglioStack(p), this.getQuantityForProduct(p), this.formatPrice(p.price!), this.formatPrice(+p.price! * this.getQuantityForProduct(p))
                  // p.image, p.productCode, p.productDesc, 'test', this.getQuantityForProduct(p), p.price, (+p.price! * this.getQuantityForProduct(p)).toFixed(2)
                ])),
                [{
                  text: 'Prezzo Totale',
                  colSpan: 6
                }, {}, {}, {}, {}, {}, this.formatPrice(orderInfo.order.productList.reduce((sum, p) => sum + (this.getQuantityForProduct(p) * +p.price!), 0))]
              ]
            }
          },
          {
            text: 'Additional Details',
            style: 'sectionHeader'
          },
          {
            text: 'Altre info',
            margin: [0, 0, 0, 15]
          },
          {
            columns: [
              // [{qr: `${orderInfo.order.user?.name}`, fit: '50'}],
              [{text: `Altre informazioni se vogliamo`, fit: '50'}],
              [{text: 'Firma se serve', alignment: 'right', italics: true}],
            ]
          },
          {
            text: 'Termini e condizioni',
            style: 'sectionHeader'
          },
          {
            ul: [
              'L\'ordine può essere cancellato o modificato entro 7 giorni al massimo.',
              'La garanzia del prodotto sarà soggetta ai termini e alle condizioni del produttore.'
            ],
          }
        ],
        footer: (currentPage: number) => {
          return {
            text: `${currentPage}/${totalPages}`,
            alignment: 'center',
            margin: [0, 10]
          };
        },
        styles: {
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          }
        }
      };
      if (orderInfo.otherInfo && orderInfo.otherInfo.action === 'download') {
        pdfMake.createPdf(documentDefinition).download();
      } else if (orderInfo.otherInfo && orderInfo.otherInfo.action === 'print') {
        pdfMake.createPdf(documentDefinition).print();
      } else {
        pdfMake.createPdf(documentDefinition).open();
      }
    }
  }

  getDettaglioStack(p: IProduct): any[] {
    const stackContent: any = [];

    if (p.idProductType === 0 || p.idProductType === 2) {
      p.colorVariants?.forEach(colorVariant => {
        stackContent.push({text: {text: `${colorVariant.descColor?.toUpperCase()}`, bold: true}});
        let textSizeVariant = '';
        colorVariant.sizeVariants?.forEach((sizeVariant, index) => {
          textSizeVariant = textSizeVariant + `${sizeVariant.descSize?.toUpperCase()} (${sizeVariant.stockOrder})`
          if (index < colorVariant.sizeVariants?.length! - 1) {
            textSizeVariant = textSizeVariant + ` - `
          }
        });
        stackContent.push({text: `${textSizeVariant}`});
        stackContent.push({text: '\n'}); // Aggiunge una riga nuova
      });
    } else {
      p.colorVariants?.forEach((colorVariant, index) => {
        stackContent.push({text: {text: `${colorVariant.descColor?.toUpperCase()}`, bold: true}});
        const textSizeVariant = `Unica (${colorVariant.stockOrder})`
        stackContent.push({text: `${textSizeVariant}`});
        stackContent.push({text: '\n'}); // Aggiunge una riga nuova
      });
    }

    return stackContent;
  }

  getQuantityForProduct(p: IProduct): any {
    let quantity: number = 0;
    if (p.idProductType === 0 || p.idProductType === 2) {
      p.colorVariants?.forEach(colorVariant => {
        colorVariant.sizeVariants?.forEach(sizeVariant => {
          quantity = quantity + sizeVariant!.stockOrder!;
        });
      });
    } else {
      p.colorVariants?.forEach((colorVariant, index) => {
        quantity = quantity + colorVariant!.stockOrder!;
      });
    }
    return quantity;
  }

  async getImageAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async loadLogoToBase64() {
    const response = await fetch('assets/img/Logo_Order_Management.png');
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = () => {
      this.logoBase64 = reader.result as string;

      // Genera il PDF con l'immagine caricata
      this.loadInfoOrder();
    };
    reader.readAsDataURL(blob);
  }

  async convertImageToBase64(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL("image/jpeg"); // Modifica il formato se necessario
        resolve(dataURL);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = url;
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
}
