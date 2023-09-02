import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaModificaColorDialogComponent } from './crea-modifica-color-dialog.component';

describe('CreaModificaClienteDialogComponent', () => {
  let component: CreaModificaColorDialogComponent;
  let fixture: ComponentFixture<CreaModificaColorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaModificaColorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaModificaColorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
