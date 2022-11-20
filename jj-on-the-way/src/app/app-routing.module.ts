import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './About-me/about-me.component';
import { AdminComponent } from './Admin/admin.component';
import { EditArticleComponent } from './Admin/edit-article/edit-article.component';
import { EditMapComponent } from './Admin/edit-map/edit-map.component';
import { LoginPageComponent } from './Admin/login-page/login-page.component';
import { NewArticleComponent } from './Admin/new-article/new-article.component';
import { BlogDetailComponent } from './Blog/blog-detail/blog-detail.component';
import { BlogComponent } from './Blog/blog.component';
import { ContactComponent } from './Contact/contact.component';
import { HomeComponent } from './Home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/login', component: LoginPageComponent },
  { path: 'admin/new-article', component: NewArticleComponent },
  { path: 'admin/edit-map', component: EditMapComponent },
  { path: 'admin/edit-article/:id', component: EditArticleComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/detail/:id', component: BlogDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about-me', component: AboutMeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
