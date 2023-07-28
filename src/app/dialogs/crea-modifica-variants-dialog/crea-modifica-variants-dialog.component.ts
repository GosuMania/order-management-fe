import {
  ChangeDetectorRef,
  Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren,
} from '@angular/core';
import {IProduct} from "../../interfaces/IProduct";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {UTILITY} from "../../constants/utility.constant";
import {VariantsProductOrderComponent} from "../../components/variants-product-order/variants-product-order.component";


@Component({
  selector: 'app-crea-modifica-variants-dialog',
  templateUrl: './crea-modifica-variants-dialog.component.html',
  styleUrls: ['./crea-modifica-variants-dialog.component.scss']
})
export class CreaModificaVariantsDialogComponent {
  product!: IProduct;
  utility = UTILITY;
  @ViewChildren('variantsProductOrderComponent') variantsProductOrderComponent!: QueryList<VariantsProductOrderComponent>;
  @ViewChild('scrollContentDialog') private scrollContentDialog: ElementRef = {} as ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private cdkRef: ChangeDetectorRef) {
    this.product = data;
  }

  changeValue(event: boolean, element: IProduct) {
    element.disableCartButton = event;
    this.cdkRef.detectChanges();
  }
}
