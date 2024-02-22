import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStrikeComponent } from './user-strike.component';

describe('UserStrikeComponent', () => {
  let component: UserStrikeComponent;
  let fixture: ComponentFixture<UserStrikeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserStrikeComponent]
    });
    fixture = TestBed.createComponent(UserStrikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
