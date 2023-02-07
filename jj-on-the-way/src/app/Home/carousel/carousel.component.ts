import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Article } from 'src/app/shared/models/article.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';

@Component({
  selector: 'jj-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent {
  @Input() articles!: Article[];
  screenWidth: number;
  articlesPerPage: number = 3;

  constructor(private articleService: ArticlesService) {
    this.screenWidth = window.innerWidth;
    this.getNumberOfArticlesPerPage();
  }

  private getNumberOfArticlesPerPage(): void {
    if (this.screenWidth > 1000) this.articlesPerPage = 3;
    if (this.screenWidth > 500 && this.screenWidth <= 1000) this.articlesPerPage = 2;
    if (this.screenWidth < 500) this.articlesPerPage = 1;
  }

  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

  getImageId(url: string) {
    if (!url) return;
    return this.articleService.getImageId(url);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    console.log(window.innerWidth)
    this.screenWidth = window.innerWidth;
    this.getNumberOfArticlesPerPage();
  }
}
