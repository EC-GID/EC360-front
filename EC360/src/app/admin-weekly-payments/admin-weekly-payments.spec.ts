import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWeeklyPayments } from './admin-weekly-payments';

describe('AdminWeeklyPayments', () => {
  let component: AdminWeeklyPayments;
  let fixture: ComponentFixture<AdminWeeklyPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWeeklyPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWeeklyPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
