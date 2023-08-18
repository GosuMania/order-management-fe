import {Component, Input} from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {IOrder} from "../../interfaces/IOrder";
import {OrderService} from "../../services/order.service";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdf-generator',
  template: `
    <button mat-icon-button style="z-index: 99" (click)="loadInfoOrder()"
            matTooltip="Stampa ordine">
      <mat-icon>print</mat-icon>
    </button>
  `,
})
export class PdfGeneratorComponent {
  @Input() orderInfo!: { order: IOrder, otherInfo: any };

  constructor(private orderService: OrderService) {
  }

  loadInfoOrder() {
    this.orderService.getOrderById(this.orderInfo.order.id!).subscribe(result => {
      this.orderInfo.order.productList = JSON.parse(JSON.stringify(result.productList));
      this.generatePDF(this.orderInfo);
    });
  }

  generatePDF(orderInfo: { order: IOrder, otherInfo: any }) {
    const documentDefinition = {
      content: [
        {
          text: 'ELECTRONIC SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: orderInfo.order.cliente?.ragioneSociale,
                bold: true
              },
              {text: orderInfo.order.cliente?.destinazioneMerce.indirizzo},
              {text: orderInfo.order.cliente?.destinazioneMerce.cap + ' ' + orderInfo.order.cliente?.destinazioneMerce.paese + ' (' + orderInfo.order.cliente?.destinazioneMerce.provincia + ')'},
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...orderInfo.order.productList.map(p => ([p.descProductType, p.price, 10, (+p.price! * 10).toFixed(2)])),
              [{
                text: 'Total Amount',
                colSpan: 3
              }, {}, {}, orderInfo.order.productList.reduce((sum, p) => sum + (10 * +p.price!), 0).toFixed(2)]
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
            [{qr: `${orderInfo.order.user?.name}`, fit: '50'}],
            [{text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ul: [
            'Order can be return in max 10 days.',
            'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            'This is system generated invoice.',
          ],
        }
      ],
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
