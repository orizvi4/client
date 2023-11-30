import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingBoxComponent } from './recording-box.component';

describe('RecordingBoxComponent', () => {
  let component: RecordingBoxComponent;
  let fixture: ComponentFixture<RecordingBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordingBoxComponent]
    });
    fixture = TestBed.createComponent(RecordingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
