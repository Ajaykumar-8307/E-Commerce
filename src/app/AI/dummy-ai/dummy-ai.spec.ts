import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyAi } from './dummy-ai';

describe('DummyAi', () => {
  let component: DummyAi;
  let fixture: ComponentFixture<DummyAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyAi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
