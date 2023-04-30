import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsProductOrderComponent } from './variants-product-order.component';

describe('VariantsProductOrderComponent', () => {
  let component: VariantsProductOrderComponent;
  let fixture: ComponentFixture<VariantsProductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantsProductOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantsProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
