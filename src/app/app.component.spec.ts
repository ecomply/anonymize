import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [ReactiveFormsModule],
      providers: [],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Ecomply Anonymize Application'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Ecomply Anonymize Application');
  });

  it('should render title in the header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header h1')?.textContent).toContain('Ecomply Anonymize Application');
  });
});
