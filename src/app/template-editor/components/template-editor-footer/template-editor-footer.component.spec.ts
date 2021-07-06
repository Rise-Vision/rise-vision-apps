import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEditorFooterComponent } from './template-editor-footer.component';

describe('TemplateEditorFooterComponent', () => {
  let component: TemplateEditorFooterComponent;
  let fixture: ComponentFixture<TemplateEditorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateEditorFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
