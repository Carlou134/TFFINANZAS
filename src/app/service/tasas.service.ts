import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tasas } from '../models/Tasas';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class TasasService {
  private url = `${base_url}/tasas`;
  private listaCambio = new Subject<Tasas[]>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = sessionStorage.getItem('token') || '';
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  list() {
    return this.http.get<Tasas[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ta: Tasas) {
    return this.http.post(this.url, ta, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: Tasas[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Tasas>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Tasas) {
    return this.http.put(this.url, c, {
      headers: this.getHeaders()
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
