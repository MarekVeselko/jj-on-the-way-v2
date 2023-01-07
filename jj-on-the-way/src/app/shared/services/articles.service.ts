import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Article } from '../models/article.model';
import { CREATE_ARTICLE_URL, DELETE_ARTICLE_URL, EDIT_ARTICLE_URL, GET_ARTICLES_URL, GET_ARTICLE_BY_COUNTRY_URL, GET_ARTICLE_URL } from '../constants/urls';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getArticles(lang: string | null, articleType: string, sectionType?: string | null, searchedText?: string | null): Observable<Article[]> {
    let url;
    const section = sectionType ? sectionType : 'all';
    if (searchedText) url = articleType + '/' + section + '/' + searchedText;
    else url = lang + '/' + articleType + '/' + section;
    return this.http.get<Article[]>(GET_ARTICLES_URL + url);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(GET_ARTICLE_URL + id);
  }

  getArticleByCountry(lang: string, country: string): Observable<Article> {
    return this.http.get<Article[]>(GET_ARTICLE_BY_COUNTRY_URL + lang + '/' + country)
      .pipe(map(response => {
        return response[0];
      }))

  }

  createArticle(data: Article): Observable<any> {
    return this.http.post(CREATE_ARTICLE_URL, data);
  }

  editArticle(data: Article): Observable<any> {
    return this.http.put(EDIT_ARTICLE_URL, data);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(DELETE_ARTICLE_URL + id);
  }

  getImageId(imageUrl: string) {
    const firstPart = imageUrl.substring(imageUrl.indexOf('/d/')).replace('/d/', '');
    return firstPart.substring(0, firstPart.indexOf('/view'));
  }

}


