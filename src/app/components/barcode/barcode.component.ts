import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode',
  template: '<canvas #barcodeCanvas></canvas>',
})
export class BarcodeComponent implements AfterViewInit, OnChanges {
  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef;
  @Input() barcodeValue: string = '';

  ngAfterViewInit() {
    this.generateBarcode();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['barcodeValue'] && !changes['barcodeValue'].firstChange) {
      this.generateBarcode();
    }
  }

  private generateBarcode() {
    JsBarcode(this.barcodeCanvas.nativeElement, this.barcodeValue, {
      format: 'CODE128',
      displayValue: true,
    });
  }
}
