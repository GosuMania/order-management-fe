import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaVariantsDialogComponent } from './crea-modifica-variants-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaVariantsDialogComponent;
  let fixture: ComponentFixture<CreaModificaVariantsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaVariantsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaVariantsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
