import {Component, Input} from '@angular/core';
import * as ExcelJS from 'exceljs';
import {OrderService} from "../../services/order.service";
import {IOrder} from "../../interfaces/IOrder";

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
  header = ['Ragione Sociale', 'Codice Fiscale', 'Indirizzo', 'Categoria', 'Classe', 'Data Inizio', 'Data Scadenza'];
  data = [
    ['Ordine', 'Codice', 'Descrizione', 'Colore', 'Taglie', 'Qta', 'Totale'],
    ['Alice', 'Rossi', 30],
    ['Bob', 'Verdi', 25],
    ['Charlie', 'Bianchi', 35]
  ];

  constructor(private orderService: OrderService) {
  }

  generateExcelData() {
    this.orderService.getOrderProviderPDF(this.valueFilter.provider, this.valueFilter.season).subscribe((data: IOrder[]) => {
      console.log('Data: ', data);
    });
  }

  generateExcel() {
    let data: any[] = [];
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
    const worksheet = workbook.addWorksheet('Dati');

    // Definisci larghezza delle colonne (in punti)
    const columnWidths = [
      {width: 20}, // Larghezza colonna A
      {width: 20}, // Larghezza colonna B
      {width: 30}, // Larghezza colonna C
      {width: 15}, // Larghezza colonna D
      {width: 15}, // Larghezza colonna E
      {width: 15}, // Larghezza colonna F
      {width: 15}  // Larghezza colonna G
    ];

    // Applica dimensioni fisse alle colonne
    columnWidths.forEach((width, colIndex) => {
      worksheet.getColumn(colIndex + 1).width = width.width;
    });

    // Aggiungi l'header con stili
    worksheet.addRow([
      'Ragione Sociale',
      'Codice Fiscale',
      'Indirizzo',
      'Categoria',
      'Classe',
      'Data Inizio',
      'Data Scadenza'
    ]);

    // Applica stili all'header
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = {...cell.style, ...{font: {bold: true}}};
    });

    let rowStart = 2;
// Aggiungi i dati
    data.forEach((row, index) => {
      const newRow = worksheet.addRow([
        row.ragioneSociale,
        row.codiceFiscale,
        row.indirizzo,
        row.categoria,
        row.classe,
        row.dataInizio,
        row.dataScadenza
      ]);
      newRow.eachCell((cell) => {
        cell.alignment = {wrapText: true}; // Applica wrap text a ogni cella
      });

      // Unifica le celle verticalmente
      if (row.ragioneSociale && row.ragioneSociale !== '') {
        if (index > 0 && (data[index - 1].ragioneSociale == null || data[index - 1].ragioneSociale === '')) {
          worksheet.mergeCells(`A${rowStart}:A${index + 1}`);
          worksheet.mergeCells(`B${rowStart}:B${index + 1}`);
          worksheet.mergeCells(`C${rowStart}:C${index + 1}`);
        }
        rowStart = index + 2;
      }
    });

    // Unisci l'ultima riga se è vuota
    if (data.length > 0) {
      worksheet.mergeCells(`A${rowStart}:A${data.length + 1}`);
    }


    // Salva il file Excel
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file_excel.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
