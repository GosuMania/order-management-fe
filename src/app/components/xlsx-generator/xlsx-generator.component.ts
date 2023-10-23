import {Component, Input} from '@angular/core';
import * as ExcelJS from 'exceljs';
import {OrderService} from "../../services/order.service";
import {IOrder} from "../../interfaces/IOrder";
import {CommonService} from "../../services/common.service";
import {IProduct, ISizeVariant} from "../../interfaces/IProduct";

@Component({
  selector: 'app-xlsx-generator',
  templateUrl: './xlsx-generator.component.html',
  styleUrls: ['./xlsx-generator.component.scss']
})
export class XlsxGeneratorComponent {
  @Input() valueFilter: { provider: any, season: any, isDisabled: boolean } = {
    provider: null,
    season: null,
    isDisabled: false
  };

  constructor(private orderService: OrderService, private commonService: CommonService) {
  }

  generateExcelData() {
    this.orderService.getOrderProviderXLSX(this.valueFilter.provider.id, this.valueFilter.season.id).subscribe((data: IOrder[]) => {
      console.log('Data: ', data);
      this.generateExcel(data)
    });
  }

  generateExcel(data: IOrder[]) {
    let listOneSize: IOrder[] = [];
    let listShoeSize: IOrder[] = [];
    let listEuSize: IOrder[] = [];
    let listInternationalSize: IOrder[] = [];
    let listChildrenSize: IOrder[] = [];


    data.forEach(order => {
      let productListOneSize: IProduct[] = [];
      let productListShoeSize: IProduct[] = [];
      let productListEuSize: IProduct[] = [];
      let productListInternationalSize: IProduct[] = [];
      let productListChildrenSize: IProduct[] = [];
      order.productList.forEach(product => {
        /** abbigliamento **/
        if (product.idProductType === 0) {
          switch (product.idClothingSizeType) {
            /** internazionale **/
            case 1:
              productListInternationalSize?.push(product);
              break;
            /** europea **/
            case 2:
              productListEuSize?.push(product);
              break;
            /** bambino **/
            case 3:
              productListChildrenSize?.push(product);
              break;
          }
        }

        /** scarpe **/
        if (product.idProductType === 2) {
          productListShoeSize?.push(product);
        }

        /** borse o accessori **/
        if (product.idProductType === 1 || product.idProductType === 3) {
          productListOneSize?.push(product);
        }
      });
      if (productListOneSize?.length > 0) {
        const orderTmp: IOrder = JSON.parse(JSON.stringify(order));
        orderTmp.productList = productListOneSize;
        listOneSize.push(orderTmp);
      }

      if (productListShoeSize?.length > 0) {
        const orderTmp: IOrder = JSON.parse(JSON.stringify(order));
        orderTmp.productList = productListShoeSize;
        listShoeSize.push(orderTmp);
      }

      if (productListEuSize?.length > 0) {
        const orderTmp: IOrder = JSON.parse(JSON.stringify(order));
        orderTmp.productList = productListEuSize;
        listEuSize.push(orderTmp);
      }

      if (productListInternationalSize?.length > 0) {
        const orderTmp: IOrder = JSON.parse(JSON.stringify(order));
        orderTmp.productList = productListInternationalSize;
        listInternationalSize.push(orderTmp);
      }

      if (productListChildrenSize?.length > 0) {
        const orderTmp: IOrder = JSON.parse(JSON.stringify(order));
        orderTmp.productList = productListChildrenSize;
        listChildrenSize.push(orderTmp);
      }
    });

    /*
    LISTA.forEach(element => {
      element.CategorieLista.forEach((cat, index) => {
        let object: any;
        if (index === 0) {
          object = {
            ragioneSociale: element.Denominazione,
            codiceFiscale: element.IdentificativoImpresa,
            indirizzo: element.Via + ' ' + element.Comune + ' (' + element.Provincia + ') ' + element.Cap,
            categoria: cat.SiglaCategoria,
            classe: cat.Classe,
            dataInizio: cat.DataIscrizione,
            dataScadenza: cat.DataScadenza
          };
        } else {
          object = {
            ragioneSociale: '',
            codiceFiscale: '',
            indirizzo: '',
            categoria: cat.SiglaCategoria,
            classe: cat.Classe,
            dataInizio: cat.DataIscrizione,
            dataScadenza: cat.DataScadenza
          };
        }
        if (object.dataScadenza && object.dataScadenza !== '') {
          data.push(object);
        }
      });
    });
     */

    // Crea un nuovo documento Excel
    const workbook = new ExcelJS.Workbook();
    if (listOneSize.length > 0) {
      const worksheet = workbook.addWorksheet('Borse e Accessori');

      // Definisci larghezza delle colonne (in punti)
      const columnWidths = [
        {width: 20}, // Larghezza colonna N° Ordine
        {width: 20}, // Larghezza colonna Codice a Barre
        {width: 20}, // Larghezza colonna Codice Articolo
        {width: 35}, // Larghezza colonna Descrizione Articolo
        {width: 20}, // Larghezza colonna Colore
        {width: 5}, // Larghezza colonna Taglia Unica
      ];
      // Applica dimensioni fisse alle colonne
      columnWidths.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width.width;
      });

      // Aggiungi l'header con stili
      worksheet.addRow([
        'N° Ordine',
        'Codice Articolo',
        'Codice a Barre',
        'Descrizione Articolo',
        'Colore',
        'Taglia Unica',
      ]);

      // Applica stili all'header
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {...cell.style, ...{font: {bold: true}}};
      });

      let rowStart = 2;
      // Aggiungi i dati
      listOneSize.forEach((order, index) => {
        order.productList.forEach(product => {
          product.colorVariants?.forEach(colorVariant => {
            const newRow = worksheet.addRow([
              order.id,
              product.productCode,
              product.barcode,
              product.productDesc,
              colorVariant.descColor,
              colorVariant.stockOrder,
            ]);
            newRow.eachCell((cell) => {
              cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
            });
          });
        });
        // Unifica le celle verticalmente
        /*
        if (row.ragioneSociale && row.ragioneSociale !== '') {
          if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
            worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
            worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
            worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
          }
          rowStart = index + 2;
        }
         */
      });

      // Unisci l'ultima riga se è vuota
      /*
      if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
      }
       */

    }

    if (listShoeSize.length > 0) {
      const worksheet = workbook.addWorksheet('Scarpe');

      // Definisci larghezza delle colonne (in punti)
      const columnWidths = [
        {width: 20}, // Larghezza colonna N° Ordine
        {width: 20}, // Larghezza colonna Codice Articolo
        {width: 20}, // Larghezza colonna Codice a Barre
        {width: 35}, // Larghezza colonna Descrizione Articolo
        {width: 20}, // Larghezza colonna Colore
        {width: 5}, // Larghezza colonna 35
        {width: 5}, // Larghezza colonna 36
        {width: 5}, // Larghezza colonna 37
        {width: 5}, // Larghezza colonna 38
        {width: 5}, // Larghezza colonna 39
        {width: 5}, // Larghezza colonna 40
        {width: 5}, // Larghezza colonna 41
        {width: 5}, // Larghezza colonna 42
        {width: 5}, // Larghezza colonna 43
        {width: 5}, // Larghezza colonna 44
        {width: 5}, // Larghezza colonna 45
        {width: 5}, // Larghezza colonna 46
      ];
      // Applica dimensioni fisse alle colonne
      columnWidths.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width.width;
      });

      // Aggiungi l'header con stili
      worksheet.addRow([
        'N° Ordine',
        'Codice Articolo',
        'Codice a Barre',
        'Descrizione Articolo',
        'Colore',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46'
      ]);

      // Applica stili all'header
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {...cell.style, ...{font: {bold: true}}};
      });

      // Aggiungi i dati
      listShoeSize.forEach((order, index) => {
        order.productList.forEach(product => {
          product.colorVariants?.forEach(colorVariant => {
            const newRow = worksheet.addRow([
              order.id,
              product.productCode,
              product.barcode,
              product.productDesc,
              colorVariant.descColor,
              this.findVariantShoe(0, colorVariant.sizeVariants!),
              this.findVariantShoe(1, colorVariant.sizeVariants!),
              this.findVariantShoe(2, colorVariant.sizeVariants!),
              this.findVariantShoe(3, colorVariant.sizeVariants!),
              this.findVariantShoe(4, colorVariant.sizeVariants!),
              this.findVariantShoe(5, colorVariant.sizeVariants!),
              this.findVariantShoe(6, colorVariant.sizeVariants!),
              this.findVariantShoe(7, colorVariant.sizeVariants!),
              this.findVariantShoe(8, colorVariant.sizeVariants!),
              this.findVariantShoe(9, colorVariant.sizeVariants!),
              this.findVariantShoe(10, colorVariant.sizeVariants!),
              this.findVariantShoe(11, colorVariant.sizeVariants!),
            ]);
            /*
            newRow.eachCell((cell) => {
              cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
            });
             */
          });
        });
        // Unifica le celle verticalmente
        /*
        if (row.ragioneSociale && row.ragioneSociale !== '') {
          if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
            worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
            worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
            worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
          }
          rowStart = index + 2;
        }
         */
      });

      // Unisci l'ultima riga se è vuota
      /*
      if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
      }
       */

    }

    if (listEuSize.length > 0) {
      const worksheet = workbook.addWorksheet('Abbigliamento EU');

      // Definisci larghezza delle colonne (in punti)
      const columnWidths = [
        {width: 20}, // Larghezza colonna N° Ordine
        {width: 20}, // Larghezza colonna Codice Articolo
        {width: 20}, // Larghezza colonna Codice a Barre
        {width: 35}, // Larghezza colonna Descrizione Articolo
        {width: 20}, // Larghezza colonna Colore
        {width: 5}, // Larghezza colonna 30
        {width: 5}, // Larghezza colonna 31
        {width: 5}, // Larghezza colonna 32
        {width: 5}, // Larghezza colonna 33
        {width: 5}, // Larghezza colonna 34
        {width: 5}, // Larghezza colonna 35
        {width: 5}, // Larghezza colonna 36
        {width: 5}, // Larghezza colonna 37
        {width: 5}, // Larghezza colonna 38
        {width: 5}, // Larghezza colonna 39
        {width: 5}, // Larghezza colonna 40
        {width: 5}, // Larghezza colonna 41
        {width: 5}, // Larghezza colonna 42
        {width: 5}, // Larghezza colonna 43
        {width: 5}, // Larghezza colonna 44
        {width: 5}, // Larghezza colonna 45
        {width: 5}, // Larghezza colonna 46
        {width: 5}, // Larghezza colonna 47
        {width: 5}, // Larghezza colonna 48
        {width: 5}, // Larghezza colonna 49
        {width: 5}, // Larghezza colonna 50
        {width: 5}, // Larghezza colonna 51
        {width: 5}, // Larghezza colonna 52
        {width: 5}, // Larghezza colonna 53
        {width: 5}, // Larghezza colonna 54
      ];
      // Applica dimensioni fisse alle colonne
      columnWidths.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width.width;
      });

      // Aggiungi l'header con stili
      worksheet.addRow([
        'N° Ordine',
        'Codice Articolo',
        'Codice a Barre',
        'Descrizione Articolo',
        'Colore',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50',
        '51',
        '52',
        '53',
        '54',
      ]);

      // Applica stili all'header
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {...cell.style, ...{font: {bold: true}}};
      });

      // Aggiungi i dati
      listEuSize.forEach((order, index) => {
        order.productList.forEach(product => {
          product.colorVariants?.forEach(colorVariant => {
            const newRow = worksheet.addRow([
              order.id,
              product.productCode,
              product.barcode,
              product.productDesc,
              colorVariant.descColor,
              this.findVariantShoe(0, colorVariant.sizeVariants!),
              this.findVariantShoe(1, colorVariant.sizeVariants!),
              this.findVariantShoe(2, colorVariant.sizeVariants!),
              this.findVariantShoe(3, colorVariant.sizeVariants!),
              this.findVariantShoe(4, colorVariant.sizeVariants!),
              this.findVariantShoe(5, colorVariant.sizeVariants!),
              this.findVariantShoe(6, colorVariant.sizeVariants!),
              this.findVariantShoe(7, colorVariant.sizeVariants!),
              this.findVariantShoe(8, colorVariant.sizeVariants!),
              this.findVariantShoe(9, colorVariant.sizeVariants!),
              this.findVariantShoe(10, colorVariant.sizeVariants!),
              this.findVariantShoe(11, colorVariant.sizeVariants!),
              this.findVariantShoe(12, colorVariant.sizeVariants!),
              this.findVariantShoe(13, colorVariant.sizeVariants!),
              this.findVariantShoe(14, colorVariant.sizeVariants!),
              this.findVariantShoe(15, colorVariant.sizeVariants!),
              this.findVariantShoe(16, colorVariant.sizeVariants!),
              this.findVariantShoe(17, colorVariant.sizeVariants!),
              this.findVariantShoe(18, colorVariant.sizeVariants!),
              this.findVariantShoe(19, colorVariant.sizeVariants!),
              this.findVariantShoe(20, colorVariant.sizeVariants!),
              this.findVariantShoe(21, colorVariant.sizeVariants!),
              this.findVariantShoe(22, colorVariant.sizeVariants!),
              this.findVariantShoe(23, colorVariant.sizeVariants!),
              this.findVariantShoe(24, colorVariant.sizeVariants!)
            ]);
            /*
            newRow.eachCell((cell) => {
              cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
            });
             */
          });
        });
        // Unifica le celle verticalmente
        /*
        if (row.ragioneSociale && row.ragioneSociale !== '') {
          if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
            worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
            worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
            worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
          }
          rowStart = index + 2;
        }
         */
      });

      // Unisci l'ultima riga se è vuota
      /*
      if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
      }
       */

    }

    if (listInternationalSize.length > 0) {
      const worksheet = workbook.addWorksheet('Abbigliamento Int');

      // Definisci larghezza delle colonne (in punti)
      const columnWidths = [
        {width: 20}, // Larghezza colonna N° Ordine
        {width: 20}, // Larghezza colonna Codice Articolo
        {width: 20}, // Larghezza colonna Codice a Barre
        {width: 35}, // Larghezza colonna Descrizione Articolo
        {width: 20}, // Larghezza colonna Colore
        {width: 5}, // Larghezza colonna xxxs
        {width: 5}, // Larghezza colonna xxs
        {width: 5}, // Larghezza colonna xs
        {width: 5}, // Larghezza colonna s
        {width: 5}, // Larghezza colonna m
        {width: 5}, // Larghezza colonna l
        {width: 5}, // Larghezza colonna xl
        {width: 5}, // Larghezza colonna xxl
        {width: 5}, // Larghezza colonna xxxl
      ];
      // Applica dimensioni fisse alle colonne
      columnWidths.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width.width;
      });

      // Aggiungi l'header con stili
      worksheet.addRow([
        'N° Ordine',
        'Codice Articolo',
        'Codice a Barre',
        'Descrizione Articolo',
        'Colore',
        'xxxs',
        'xxs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        'xxl',
        'xxxl',
      ]);

      // Applica stili all'header
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {...cell.style, ...{font: {bold: true}}};
      });

      // Aggiungi i dati
      listInternationalSize.forEach((order, index) => {
        order.productList.forEach(product => {
          product.colorVariants?.forEach(colorVariant => {
            const newRow = worksheet.addRow([
              order.id,
              product.productCode,
              product.barcode,
              product.productDesc,
              colorVariant.descColor,
              this.findVariantShoe(0, colorVariant.sizeVariants!),
              this.findVariantShoe(1, colorVariant.sizeVariants!),
              this.findVariantShoe(2, colorVariant.sizeVariants!),
              this.findVariantShoe(3, colorVariant.sizeVariants!),
              this.findVariantShoe(4, colorVariant.sizeVariants!),
              this.findVariantShoe(5, colorVariant.sizeVariants!),
              this.findVariantShoe(6, colorVariant.sizeVariants!),
              this.findVariantShoe(7, colorVariant.sizeVariants!),
              this.findVariantShoe(8, colorVariant.sizeVariants!),
            ]);
            /*
            newRow.eachCell((cell) => {
              cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
            });
             */
          });
        });
        // Unifica le celle verticalmente
        /*
        if (row.ragioneSociale && row.ragioneSociale !== '') {
          if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
            worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
            worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
            worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
          }
          rowStart = index + 2;
        }
         */
      });

      // Unisci l'ultima riga se è vuota
      /*
      if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
      }
       */

    }

    if (listChildrenSize.length > 0) {
      const worksheet = workbook.addWorksheet('Abbigliamento Bambini');

      // Definisci larghezza delle colonne (in punti)
      const columnWidths = [
        {width: 20}, // Larghezza colonna N° Ordine
        {width: 20}, // Larghezza colonna Codice Articolo
        {width: 20}, // Larghezza colonna Codice a Barre
        {width: 35}, // Larghezza colonna Descrizione Articolo
        {width: 20}, // Larghezza colonna Colore
        {width: 5}, // Larghezza colonna xxxs
        {width: 5}, // Larghezza colonna xxs
        {width: 5}, // Larghezza colonna xs
        {width: 5}, // Larghezza colonna s
        {width: 5}, // Larghezza colonna m
        {width: 5}, // Larghezza colonna l
        {width: 5}, // Larghezza colonna xl
        {width: 5}, // Larghezza colonna xxl
        {width: 5}, // Larghezza colonna xxxl
      ];
      // Applica dimensioni fisse alle colonne
      columnWidths.forEach((width, colIndex) => {
        worksheet.getColumn(colIndex + 1).width = width.width;
      });

      // Aggiungi l'header con stili
      worksheet.addRow([
        'N° Ordine',
        'Codice Articolo',
        'Codice a Barre',
        'Descrizione Articolo',
        'Colore',
        '0-3 mesi',
        '6 mesi',
        '9 mesi',
        '12 mesi',
        '18 mesi',
        '36 mesi',
        '4 anni',
        '6 anni',
        '8 anni',
        '10 anni',
        '12 anni',
        '14 anni',
        '16 anni',
      ]);

      // Applica stili all'header
      worksheet.getRow(1).eachCell((cell) => {
        cell.style = {...cell.style, ...{font: {bold: true}}};
      });

      // Aggiungi i dati
      listChildrenSize.forEach((order, index) => {
        order.productList.forEach(product => {
          product.colorVariants?.forEach(colorVariant => {
            const newRow = worksheet.addRow([
              order.id,
              product.productCode,
              product.barcode,
              product.productDesc,
              colorVariant.descColor,
              this.findVariantShoe(0, colorVariant.sizeVariants!),
              this.findVariantShoe(1, colorVariant.sizeVariants!),
              this.findVariantShoe(2, colorVariant.sizeVariants!),
              this.findVariantShoe(3, colorVariant.sizeVariants!),
              this.findVariantShoe(4, colorVariant.sizeVariants!),
              this.findVariantShoe(5, colorVariant.sizeVariants!),
              this.findVariantShoe(6, colorVariant.sizeVariants!),
              this.findVariantShoe(7, colorVariant.sizeVariants!),
              this.findVariantShoe(8, colorVariant.sizeVariants!),
              this.findVariantShoe(9, colorVariant.sizeVariants!),
              this.findVariantShoe(10, colorVariant.sizeVariants!),
              this.findVariantShoe(11, colorVariant.sizeVariants!),
              this.findVariantShoe(12, colorVariant.sizeVariants!),
              this.findVariantShoe(13, colorVariant.sizeVariants!),
            ]);
            /*
            newRow.eachCell((cell) => {
              cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
            });
             */
          });
        });
        // Unifica le celle verticalmente
        /*
        if (row.ragioneSociale && row.ragioneSociale !== '') {
          if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
            worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
            worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
            worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
          }
          rowStart = index + 2;
        }
         */
      });

      // Unisci l'ultima riga se è vuota
      /*
      if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
      }
       */

    }


// Salva il file Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.valueFilter.provider.ragioneSociale + '_' + this.valueFilter.season.desc + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  findVariantShoe(id: number, sizeVariants: ISizeVariant[]): string | number {
    let quantity = 0;
    const variant = sizeVariants.find(variant => id === variant.id);
    if(variant && variant.stockOrder) {
      quantity = variant.stockOrder;
    }
    return  quantity;
  }
}
