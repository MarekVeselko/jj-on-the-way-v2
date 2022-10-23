import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Article } from 'src/app/shared/models/article.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ArticleDialogComponent } from '../article-dialog/article-dialog.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';

@Component({
    selector: 'app-edit-article',
    templateUrl: './edit-article.component.html',
    styleUrls: ['./edit-article.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditArticleComponent implements OnInit {
    @ViewChild(ArticleFormComponent) formComponent!: ArticleFormComponent;
    article!: Article | null;
    constructor(public location: Location,
        private router: Router,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private articleService: ArticlesService,
        private userService: UserService) {
        if (!userService.isLoggedIn) {
            router.navigate(['./admin'])
        }

    }

    ngOnInit(): void {
        this.articleService.getArticle(this.route.snapshot.params['id']).subscribe(response => {
            this.article = response;
        })
    }

    onSubmit(operationType: string) {
        const form = this.formComponent.onSubmit();
        if (!form) return;

        const dialogRef = this.dialog.open(ArticleDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.login({ pin: result.pin }).pipe(catchError((err) => {
                    this.toastr.error('Nesprávny PIN', '', {
                        positionClass: 'toast-bottom-center',
                        timeOut: 2000
                    });
                    this.dialog.closeAll();
                    return throwError(err);
                })).subscribe((response) => {
                        const isPublished = operationType === 'SAVE' ? false : true;
                        const data = {
                            ...form.value,
                            id: this.article?.id,
                            dateCreated: this.article?.dateCreated,
                            isDeleted: false,
                            published: isPublished
                        } as Article;
                        this.articleService.editArticle(data).pipe(catchError((error) => {
                            this.toastr.error('Pri editácií článku nastala chyba', 'Refreshni stránku a skús ešte raz.', {
                                positionClass: 'toast-bottom-center',
                                timeOut: 2000
                            });
                            return throwError(error);
                        })).subscribe(() => {
                            const toastMessage = data.published ? 'Článok úspešne publikovaný!' : 'Článok úspešne uložený!'
                            this.toastr.success(toastMessage, '', {
                                positionClass: 'toast-bottom-center',
                                timeOut: 2000
                            });
                            this.router.navigate(['../../'], { relativeTo: this.route })
                        })
                })

            }
        });
    }

}
