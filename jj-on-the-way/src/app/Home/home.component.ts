import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener, Renderer2, Inject, OnDestroy } from '@angular/core';
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
  articles!: Article[];
  public screenWidth!: number;
  script: any;
  pins!: { x: string, y: string }[];

  constructor(private articleService: ArticlesService,
    private mapService: MapService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    this.script = this.renderer2.createElement('script');
    this.script.text = '(function(d, s, id) { var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js); }(document, "script", "EmbedSocialHashtagScript"));';
    this.renderer2.appendChild(this.document.body, this.script);
    this.articleService.getArticles('PUBLISHED').subscribe(response => {
      if (response.length >= 5) {
        this.articles = response.slice(0, 5);
      } else {
        this.articles = response;
      }
      this.cdr.markForCheck();
    })

    this.mapService.getMap().subscribe(response => {
      this.pins = response[0].pins;
    })
  }

  ngOnDestroy(): void {
    this.renderer2.removeChild(this.document.body, this.script);
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialHashtagScript'));
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialNewPopup'));
    this.renderer2.removeChild(this.document.body, this.document.getElementById('EmbedSocialIFrame'));

  }

  getImageId(url: string) {
    if (!url) return;
    return this.articleService.getImageId(url);
  }

  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
  }
}
