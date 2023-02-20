import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener, Renderer2, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { MapService } from '../shared/services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('image') image!: ElementRef;
  articles!: Article[];
  script: any;
  pins!: { x: string, y: string, country: string }[];

  constructor(private articleService: ArticlesService,
    private mapService: MapService,
    private router: Router,
    private renderer2: Renderer2,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef) {
    this.translate.onLangChange
      .subscribe((event: LangChangeEvent) => {
        if (this.router.url === '/') {
          this.getItems();
        }
      });
  }

  ngOnInit(): void {
    this.script = this.renderer2.createElement('script');
    this.script.text = '(function(d, s, id) { var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js); }(document, "script", "EmbedSocialHashtagScript"));';
    this.renderer2.appendChild(this.document.body, this.script);
    this.getItems();
    this.mapService.getMap().subscribe(response => {
      this.pins = response[0].pins;
    })
  }

  getItems() {
    const lang = this.translate.currentLang || 'sk';
    this.articleService.getArticles(lang, 'PUBLISHED').subscribe(response => {
      if (response.length >= 5) {
        this.articles = response.slice(0, 5);
      } else {
        this.articles = response;
      }
      this.cdr.markForCheck();
    })
  }

  onPinClick(pin: { x: string, y: string, country: string }) {
    this.deleteBubble();
    let article = null;
    this.articleService.getArticleByCountry(this.translate.currentLang || 'sk', pin.country).pipe(catchError(error => {
      this.createBubble(pin);
      return throwError(error);
    })).subscribe(res => {
      article = res;
      this.createBubble(pin, article);
    })
  }

  private createBubble(pin: { x: string, y: string, country: string }, article?: Article) {
    const articleBubble = this.document.createElement('div');
    articleBubble.setAttribute('class', 'jj-bubble');
    articleBubble.setAttribute('id', 'article-bubble');
    articleBubble.style.setProperty('transform', 'translate(-50%, -50%');
    articleBubble.style.top = pin.y;
    articleBubble.style.left = pin.x;
    const topDiv = this.document.createElement('div');
    topDiv.innerHTML = pin.country.charAt(0).toUpperCase() + pin.country.substring(1, pin.country.length);
    topDiv.setAttribute('class', 'header');
    const xButton = this.document.createElement('span');
    xButton.setAttribute('class', 'x-button');
    xButton.innerHTML = 'X';
    xButton.addEventListener('click', () => {
      articleBubble.style.display = 'none';
    });
    articleBubble.appendChild(topDiv);
    topDiv.appendChild(xButton);
    if (article) {
      const h2 = this.document.createElement('h2');
      const span = this.document.createElement('span');
      const button = this.document.createElement('button');
      button.addEventListener('click', () => {
        this.router.navigate(['./blog/detail', article.id]);
      });
      button.innerHTML = this.translate.instant('jj.readMore');
      button.setAttribute('class', 'read-more-button');
      h2.innerHTML = this.truncate(article?.title, 100, '...');
      span.innerHTML = this.truncate(article?.perex, 200, '...');
      articleBubble.appendChild(h2);
      articleBubble.appendChild(span);
      articleBubble.appendChild(button);

    } else {
      const noArticles = this.document.createElement('div');
      const noArticlesText = this.document.createElement('span');
      noArticlesText.innerHTML = this.translate.instant('jj.noArticlesForLocation');
      noArticles.setAttribute('class', 'no-articles-location');
      noArticles.appendChild(noArticlesText);
      articleBubble.appendChild(noArticles);
    }
    this.document.getElementById('map')?.appendChild(articleBubble);
  }

  private deleteBubble() {
    if (this.document.getElementById('article-bubble')) {
      this.document.getElementById("article-bubble")?.remove();
    }
  }
  ngOnDestroy(): void {
    this.renderer2.removeChild(this.document.body, this.script);
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialHashtagScript'));
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialNewPopup'));
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialIFrame'));

  }
  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

}
