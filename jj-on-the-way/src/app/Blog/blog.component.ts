import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

interface Section {
  name: string,
  value: string
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit, AfterViewInit {
  articles!: Observable<any>;
  dataLength: number = 0;
  dataSource = new MatTableDataSource<Article>();
  sectionType!: string;
  @ViewChild('paginator') paginator!: MatPaginator;
  paginatorIndex = 0;
  sections: Section[];
  timeout: any = null;


  constructor(private articleService: ArticlesService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    this.sections = [
      { name: 'jj.all', value: 'all' },
      { name: 'jj.general', value: 'general' },
      { name: 'jj.europe', value: 'europe' },
      { name: 'jj.asia', value: 'asia' },
      { name: 'jj.africa', value: 'africa' },
      { name: 'jj.northAmerica', value: 'northAmerica' },
      { name: 'jj.southAmerica', value: 'southAmerica' },
    ];

    this.translate.onLangChange
    .subscribe((event: LangChangeEvent) => {
      this.getItems();
  });
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(searchedText?: string) {
    const lang = this.translate.currentLang || 'sk';
    this.articleService.getArticles(lang, 'PUBLISHED', this.sectionType, searchedText).subscribe(response => {
      this.dataSource.data = response;
      this.dataLength = this.dataSource.data.length
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorIndex = this.paginator.pageIndex;
    this.articles = this.dataSource.connect();
    this.cdr.markForCheck();
  }

  getImageId(imageUrl: string) {
    return this.articleService.getImageId(imageUrl);
  }

  search(searchedText?: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      this.getItems(searchedText);
    }, 500);
  }


  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

}
