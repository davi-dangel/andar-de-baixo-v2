import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HeadLine } from '../../models/headline.model';
import { DataService } from '../../services/data.service';
import { ArticleComponent } from './article.component';

describe('ArticleComponent pages', () => {
  it('shows only the current page and navigates between pages', async () => {
    const article = new HeadLine({
      pages: [
        { number: 1, content: [{ type: 'PARAGRAPH', value: 'First page' }] },
        { number: 2, content: [{ type: 'PARAGRAPH', value: 'Second page' }] }
      ]
    });
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
        { provide: DataService, useValue: { Get: () => article } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.detectChanges();

    const paragraphs = (): string[] => Array.from(
      fixture.nativeElement.querySelectorAll('app-paragraph p') as NodeListOf<HTMLElement>,
      paragraph => paragraph.textContent ?? ''
    );
    const pageCounters = (): string[] => Array.from(
      fixture.nativeElement.querySelectorAll('.page-counter') as NodeListOf<HTMLElement>,
      counter => counter.textContent?.trim() ?? ''
    );
    expect(paragraphs()).toEqual(['First page']);
    expect(pageCounters()).toEqual(['Página 1 de 2', 'Página 1 de 2']);

    const navigations = fixture.nativeElement.querySelectorAll('.page-navigation') as NodeListOf<HTMLElement>;
    const pageButtons = (navigation: HTMLElement): string[] => Array.from(
      navigation.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
      button => button.textContent?.trim() ?? ''
    );
    expect(pageButtons(navigations[0])).toEqual(['Próxima']);
    expect(pageButtons(navigations[1])).toEqual(['Próxima']);
    navigations[0].querySelector('button')?.click();
    fixture.detectChanges();

    expect(paragraphs()).toEqual(['Second page']);
    expect(pageCounters()).toEqual(['Página 2 de 2', 'Página 2 de 2']);
    expect(pageButtons(navigations[0])).toEqual(['Voltar']);
    expect(pageButtons(navigations[1])).toEqual(['Voltar']);

    navigations[1].querySelector('button')?.click();
    fixture.detectChanges();
    expect(paragraphs()).toEqual(['First page']);
    expect(pageButtons(navigations[0])).toEqual(['Próxima']);
  });
});
