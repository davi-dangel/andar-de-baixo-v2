import { TestBed } from '@angular/core/testing';
import { DataService } from '../../services/data.service';
import { HeadLine } from '../../models/headline.model';
import { PostDesignerComponent } from './post-designer.component';

describe('PostDesignerComponent pages', () => {
  it('renders the page selector and the selected page blocks', async () => {
    const article = new HeadLine({
      pages: [
        { number: 1, content: [{ type: 'PARAGRAPH', value: 'First page' }] },
        { number: 2, content: [{ type: 'PARAGRAPH', value: 'Second page' }] }
      ]
    });
    await TestBed.configureTestingModule({
      imports: [PostDesignerComponent],
      providers: [{ provide: DataService, useValue: { GetAll: () => [article] } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(PostDesignerComponent);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select[aria-label="Select a page"]');
    expect(select.options.length).toBe(2);
    select.value = '2';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.preview').textContent).toContain('Second page');
  });

  it('creates, selects, and edits pages independently in the exported article', () => {
    const article = new HeadLine({
      id: 1,
      pages: [{ number: 3, content: [{ type: 'PARAGRAPH', value: 'First page' }] }]
    });
    const dataService = jasmine.createSpyObj<DataService>('DataService', ['GetAll', 'Get']);
    dataService.GetAll.and.returnValue([article]);
    const component = new PostDesignerComponent(dataService);
    component.ngOnInit();

    component.addPage();
    component.addContent();
    const block = component.selectedPage!.content[0];
    if (block.type !== 'PARAGRAPH') {
      fail('Expected a paragraph');
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = 'Second page';
    textarea.addEventListener('input', event => component.updateParagraph(block, event));
    textarea.dispatchEvent(new Event('input'));

    const selection = document.createElement('select');
    selection.innerHTML = '<option value="3">Page 3</option>';
    selection.addEventListener('change', event => component.selectPage(event));
    selection.dispatchEvent(new Event('change'));

    expect(component.selectedPage?.number).toBe(3);
    expect(JSON.parse(component.jsonOutput).pages).toEqual([
      { number: 3, content: [{ type: 'PARAGRAPH', value: 'First page' }] },
      { number: 4, content: [{ type: 'PARAGRAPH', value: 'Second page' }] }
    ]);
  });

  it('starts a new post with page 1', () => {
    const dataService = jasmine.createSpyObj<DataService>('DataService', ['GetAll', 'Get']);
    dataService.GetAll.and.returnValue([]);
    const component = new PostDesignerComponent(dataService);
    component.ngOnInit();

    component.createPost();
    component.addContent();

    expect(component.selectedArticle?.pages).toEqual([
      { number: 1, content: [{ type: 'PARAGRAPH', value: '' }] }
    ]);
  });
});
