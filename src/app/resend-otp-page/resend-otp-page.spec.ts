import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOtpPage } from './resend-otp-page';

describe('ResendOtpPage', () => {
  let component: ResendOtpPage;
  let fixture: ComponentFixture<ResendOtpPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendOtpPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
