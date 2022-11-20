import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, tap } from 'rxjs';
import { GET_MAP_URL, SEND_EMAIL_URL, SET_MAP_URL } from '../constants/urls';
import { Map } from '../models/map.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {

  }

  getMap(): Observable<any> {
    return this.http.get(GET_MAP_URL);
  }

  updateMap(id: string, pins: { x: string, y: string }[]): Observable<any> {
    const data = {
      id: id,
      pins: pins
    }
    return this.http.put(SET_MAP_URL, data);
  }
}
