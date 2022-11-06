import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/shared/models/article.model';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import * as uuid from 'uuid';


@Component({
    selector: 'app-article-form',
    templateUrl: './article-form.component.html',
    styleUrls: ['./article-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleFormComponent implements OnInit {
    @Input() editMode = false;
    article!: Article;
    public galleryPhotos: any[] = [{
        photo: ''
    }];

    public textBlocks: any[] = [{
        text: '',
        img: ''
    }]

    readonly controls = {
        title: new FormControl('', Validators.required),
        titleImage: new FormControl('', Validators.required),
        section: new FormControl('europe', Validators.required),
        text: new FormControl([{}]),
        perex: new FormControl(''),
        gallery: new FormControl([''])
    }

    form: FormGroup = new FormGroup(this.controls);

    constructor(private articleService: ArticlesService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        if (this.editMode) {
            this.articleService.getArticle(this.route.snapshot.params['id']).subscribe(response => {
                this.article = response;
                if (this.article) {
                    this.controls.title.patchValue(this.article.title);
                    this.controls.text.patchValue(this.article.text);
                    this.controls.titleImage.patchValue(this.article.titleImage);
                    this.controls.perex.patchValue(this.article.perex);
                    this.controls.section.patchValue(this.article.section);
                    if (this.article.gallery.length > 0) {
                        this.galleryPhotos = [];
                        this.article.gallery.forEach(gp => {
                            this.galleryPhotos.push({ photo: gp });
                        })
                        this.cdr.markForCheck();
                    }

                    if (this.article.text.length > 0) {
                        this.textBlocks = [];
                        this.article.text.forEach(t => {
                            this.textBlocks.push(t);
                        })
                        this.cdr.markForCheck();
                    }
                }
            })
        }
    }

    onSubmit(): FormGroup | void {
        if (this.form.valid) {
            const gallery = this.galleryPhotos.map(p => p.photo);
            const text = this.textBlocks.map(t => t);
            this.controls.gallery.patchValue(gallery);
            this.controls.text.patchValue(text);
            return this.form;
        } else {
            this.form.markAllAsTouched();
            this.cdr.markForCheck();
            return;
        }
    }

    addLine() {
        const uniqueId = uuid.v4();
        this.galleryPhotos.push({
            id: uniqueId,
            photo: ''
        });
    }

    addTextBlock() {
        const uniqueId = uuid.v4();
        this.textBlocks.push({
            id: uniqueId,
            text: '',
            img: ''
        });
    }

    removeLine(i: number) {
        const index = this.galleryPhotos.findIndex((photo) => photo.id === i);
        this.galleryPhotos.splice(index, 1);
    }

    removeTextBlock(i: number) {
        const index = this.textBlocks.findIndex((text) => text.id === i);
        this.textBlocks.splice(index, 1);
    }

}
