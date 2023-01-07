import { environment } from "src/environments/environment";

const BASE_URL = environment.production ? '' : "http://localhost:5000/";

export const GET_ARTICLES_URL = BASE_URL + 'api/articles/all/';
export const GET_ARTICLE_BY_COUNTRY_URL = BASE_URL + 'api/articles/articlesByCountry/';
export const GET_ARTICLE_URL = BASE_URL + 'api/articles/article/';
export const CREATE_ARTICLE_URL = BASE_URL + 'api/articles/create';
export const DELETE_ARTICLE_URL = BASE_URL + 'api/articles/delete/';
export const EDIT_ARTICLE_URL = BASE_URL + 'api/articles/edit';

export const LOGIN_URL = BASE_URL + 'api/users/login';

export const SEND_EMAIL_URL = BASE_URL + 'api/email/sendmail'

export const GET_MAP_URL = BASE_URL + 'api/map'
export const SET_MAP_URL = BASE_URL + 'api/map/edit-map'
