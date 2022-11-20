import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AboutMeComponent } from './About-me/about-me.component';
import { AdminComponent } from './Admin/admin.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BlogComponent } from './Blog/blog.component';
import { ContactComponent } from './Contact/contact.component';
import { FooterComponent } from './Footer/footer.component';
import { HeaderComponent } from './Header/header.component';
import { TitlePhotoComponent } from './Header/title-photo/title-photo.component';
import { HomeComponent } from './Home/home.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticlesTableComponent } from './Admin/articles-table/articles-table.component';
import { ArticlesService } from './shared/services/articles.service';
import { ArticleFormComponent } from './Admin/article-form/article-form.component';
import { NewArticleComponent } from './Admin/new-article/new-article.component';
import { EditArticleComponent } from './Admin/edit-article/edit-article.component';
import { LoginPageComponent } from './Admin/login-page/login-page.component';
import { UserService } from './shared/services/user.service';
import { LoadingService } from './shared/services/loading.service';
import { LoadingComponent } from './shared/parts/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { BlogDetailComponent } from './Blog/blog-detail/blog-detail.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ArticleDialogComponent } from './Admin/article-dialog/article-dialog.component';
import { SnackBarComponent } from './shared/parts/snack-bar/snack-bar.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { EmailService } from './shared/services/email.service';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { ImageDialogComponent } from './Blog/blog-detail/image-dialog/image-dialog.component';
import { EditMapComponent } from './Admin/edit-map/edit-map.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TitlePhotoComponent,
    AdminComponent,
    BlogComponent,
    BlogDetailComponent,
    ImageDialogComponent,
    EditMapComponent,
    ContactComponent,
    AboutMeComponent,
    ArticlesTableComponent,
    ArticleFormComponent,
    NewArticleComponent,
    ArticleDialogComponent,
    EditArticleComponent,
    LoginPageComponent,
    LoadingComponent,
    SnackBarComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCheckboxModule,
    MatTableModule,
    MatSnackBarModule,
    IvyCarouselModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [ArticlesService, EmailService, UserService, LoadingService, {
    provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
