import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimeLogsComponent} from './admin-time-tracker-logs';

describe('AdminTimeTrackerLogs', () => {
  let component: AdminTimeLogsComponent;
  let fixture: ComponentFixture<AdminTimeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTimeLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTimeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
