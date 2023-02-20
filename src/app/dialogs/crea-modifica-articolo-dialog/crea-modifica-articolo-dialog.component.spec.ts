import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaArticoloDialogComponent } from './crea-modifica-articolo-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaArticoloDialogComponent;
  let fixture: ComponentFixture<CreaModificaArticoloDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaArticoloDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaArticoloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
