import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, throwError } from 'rxjs';
import { Article } from '../shared/models/article.model';
import { ArticlesService } from '../shared/services/articles.service';
import { LoadingService } from '../shared/services/loading.service';
import { UserService } from '../shared/services/user.service';
import { ArticleDialogComponent } from './article-dialog/article-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isLoggedIn = false;
  articles: Article[] = [];
  articleType = 'PUBLISHED';

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private articleService: ArticlesService,
    public userService: UserService,
    private toastr: ToastrService,
    private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.getItems();
    this.loadingService.showLoading();
    this.articles = this.articles.filter(a => a.published && !a.isDeleted);
  }

  getItems(): void {
    this.articleService.getArticles(this.articleType).subscribe(response => {
      this.articles = response;
    })
  }

  onTabChanged(event: any): void {
    if (event.index == 0) this.articleType = 'PUBLISHED';
    if (event.index == 1) this.articleType = 'SAVED';
    if (event.index == 2) this.articleType = 'DELETED'
    this.getItems();
    this.cdr.markForCheck();
  }

  onArticleDelete(event: string) {
    const dialogRef = this.dialog.open(ArticleDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.login({ pin: result.pin }).pipe(catchError(() => {
          this.toastr.error('Nesprávny PIN', '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000
          });
          this.dialog.closeAll();
          return of(null);
        })).subscribe((response) => {
          if (response) {
            this.articleService.deleteArticle(event).pipe(catchError((err) => {
              this.toastr.error('Pri operácií nastala chyba', 'Refreshni stránku a skús ešte raz.', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000
              });
              return throwError(err);
            })).subscribe(() => {
              this.toastr.success('Článok bol natrvalo zmazaný!', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000
              });
              this.getItems();
              this.cdr.markForCheck();
            })
          }
        })
      }
    });
  }

  onArticleRestore(event: string) {
    this.articleService.getArticle(event).subscribe(response => {
      const article = response;
      const data = {
        ...article,
        isDeleted: false
      };
      this.articleService.editArticle(data).pipe(catchError(error => {
        this.toastr.error('Pri operácií nastala chyba', 'Refreshni stránku a skús ešte raz.', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000
        });
        return of(null);
      })).subscribe(() => {
        this.toastr.success('Článok úspešne obnovený!', 'Nájdeš ho v pôvodnej záložke.', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000
        });
        this.getItems();
      })
    })
  }

  onArticleSendToBin(event: string) {
    this.articleService.getArticle(event).subscribe(response => {
      const article = response;
      const data = {
        ...article,
        isDeleted: true
      };
      this.articleService.editArticle(data).pipe(catchError(err => {
        this.toastr.error('Pri operácií nastala chyba', 'Refreshni stránku a skús ešte raz.', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000
        });
        return throwError(err);
      })).subscribe(() => {
        this.toastr.success('Článok bol presunutý do koša!', '', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000
        });
        this.getItems();
      })
    })
  }

}