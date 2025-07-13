import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerComponent } from './time-tracker';

describe('TimeTracker', () => {
  let component: TimeTrackerComponent;
  let fixture: ComponentFixture<TimeTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
