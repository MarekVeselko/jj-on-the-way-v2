import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener  } from '@angular/core';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { MapService } from '../shared/services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  articles!: Article[];
  public screenWidth!: number;

  pins!: {x: string, y: string}[];

  constructor(private articleService: ArticlesService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    this.articleService.getArticles('PUBLISHED').subscribe(response => {
      if (response.length >= 5) {
        this.articles = response.slice(0,5);
      } else {
        this.articles = response;
      }
      this.cdr.markForCheck();
    })

    this.mapService.getMap().subscribe( response => {
      this.pins = response[0].pins;
    })
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
