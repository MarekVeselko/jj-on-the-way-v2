import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from 'src/app/shared/models/article.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';

@Component({
    selector: 'app-articles-table',
    templateUrl: './articles-table.component.html',
    styleUrls: ['./articles-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesTableComponent implements AfterViewInit, OnChanges {
    displayedColumns: string[] = ['date', 'lang', 'name', 'button1', 'button2'];
    @Input() articles!: Article[];
    @Input() tabType!: string;
    @Output() deleteArticle: EventEmitter<string> = new EventEmitter<string>();
    @Output() restoreArticle: EventEmitter<string> = new EventEmitter<string>();
    @Output() sendToBinArticle: EventEmitter<string> = new EventEmitter<string>();


    dataSource = new MatTableDataSource<Article>(this.articles);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private articleService: ArticlesService) { }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource.data = this.articles;
    }

    onArticleDelete(id: string) {
        this.deleteArticle.emit(id);
    }

    onArticleRestore(id: string) {
        this.restoreArticle.emit(id);
    }

    onArticleSendToBin(id: string) {
        this.sendToBinArticle.emit(id);
    }

    toUppercase(value: string) {
      if (value) return value.toUpperCase();
      return '';
    }

}

