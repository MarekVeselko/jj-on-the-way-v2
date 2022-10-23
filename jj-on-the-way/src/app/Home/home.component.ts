import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, HostListener  } from '@angular/core';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  articles!: Article[];
  public screenWidth!: number;

  pins = [
    /// AMERIKA
    { y: '26.5%', x: '20%' },
    { y: '29%', x: '19%' },
    { y: '31%', x: '18%' },
    { y: '34.5%', x: '16.3%' },
    { y: '28%', x: '4.3%' },
    { y: '31%', x: '4.4%' },
    { y: '32.5%', x: '5.8%' },
    { y: '29.2%', x: '6%' },

    // AFRIKA
    { y: '43%', x: '40%' },
    { y: '36.5%', x: '56%' },

    // AZIA
    { y: '60%', x: '81.5%' },
    { y: '49.7%', x: '82%' },
    { y: '48%', x: '81.3%' },
    { y: '45.2%', x: '80.2%' },

    //EUROPA
    //ISLAND
    { y: '11%', x: '49%' },
    { y: '14%', x: '49.5%' },
    { y: '11.6%', x: '47%' },


    //ŠPANIELSKO
    { y: '28%', x: '42.5%' },
    { y: '27.7%', x: '44.4%' },
    { y: '29%', x: '43.5%' },

    //FRANCUZSKO
    { y: '24.5%', x: '47%' },

    //TALIANSKO
    { y: '24.5%', x: '48.7%' },

    //GRECKO
    { y: '28.5%', x: '52.3%' },
    { y: '26%', x: '51.5%' },

    //ZVYSOK EU
    { y: '23%', x: '51.4%' },
    { y: '22.5%', x: '50%' },
    { y: '19.5%', x: '50%' },
    { y: '21%', x: '48.8%' },
    { y: '19.5%', x: '47%' },
    { y: '18.3%', x: '47.5%' },
    { y: '16.9%', x: '48%' },
    { y: '20.5%', x: '44.5%' },
  ];

  constructor(private articleService: ArticlesService,
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
