import {ChangeDetectorRef, Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import * as JsBarcode from "jsbarcode";

@Component({
  selector: 'app-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.scss']
})
export class BarcodeDialogComponent {
  barcodeValue = '';
  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef;
  @ViewChild('hiddenFocusElement') hiddenFocusElement!: ElementRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private renderer: Renderer2) {
    this.barcodeValue = data.barcodeValue;
  }

  ngAfterViewInit() {
    this.generateBarcode();
    this.hiddenFocusElement.nativeElement.click();
  }

  printBarcode(barcodeValue: string) {
    const imageData: ImageData = this.generateBarcode();

    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const context = canvas.getContext('2d')!;
    context.putImageData(imageData, 0, 0);

    // Creare un URL dati per l'immagine
    const dataUrl = canvas.toDataURL('image/png');

    // Creare un elemento di ancoraggio nascosto per il download
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `barcode_${barcodeValue}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private generateBarcode(): ImageData {
    JsBarcode(this.barcodeCanvas.nativeElement, this.barcodeValue, {
      format: 'CODE128',
      displayValue: true,
    });

    const context: CanvasRenderingContext2D = this.barcodeCanvas.nativeElement.getContext('2d');
    return context.getImageData(0, 0, this.barcodeCanvas.nativeElement.width, this.barcodeCanvas.nativeElement.height);
  }

}
