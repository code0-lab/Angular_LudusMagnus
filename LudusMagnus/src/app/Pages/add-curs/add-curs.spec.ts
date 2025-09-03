import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurs } from './add-curs';

describe('AddCurs', () => {
  let component: AddCurs;
  let fixture: ComponentFixture<AddCurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
