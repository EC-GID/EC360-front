import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkLogs } from './work-logs';

describe('WorkLogs', () => {
  let component: WorkLogs;
  let fixture: ComponentFixture<WorkLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
