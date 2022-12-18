import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { Observable } from 'rxjs';

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
  sectionType: string | null = null;
  @ViewChild('paginator') paginator!: MatPaginator;
  paginatorIndex = 0;

  constructor(private articleService: ArticlesService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(searchedText?: string) {
    this.articleService.getArticles('PUBLISHED', this.sectionType, searchedText).subscribe(response => {
      this.dataSource.data = response;
      this.dataLength = this.dataSource.data.length
    })
  }

  onTabChange (event: any) {
    if (event.index == 0) this.sectionType = null;
    if (event.index == 1) this.sectionType = 'europe';
    if (event.index == 2) this.sectionType = 'asia';
    if (event.index == 3) this.sectionType = 'africa';
    if (event.index == 4) this.sectionType = 'northAmerica';
    if (event.index == 5) this.sectionType = 'southAmerica';
    this.getItems();
    this.cdr.markForCheck();
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


  truncate(str: string, max: number, suffix: string) {
    return str.length < max ? str : `${str.substr(0, str.substr(0, max - suffix.length).lastIndexOf(' '))}${suffix}`;
  }

}
