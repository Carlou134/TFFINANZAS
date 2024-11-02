import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Bancos } from '../models/Bancos';

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class BancosService {
  private url = `${base_url}/bancos`;
  private listaCambio = new Subject<Bancos[]>();

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
    return this.http.get<Bancos[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: Bancos) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: Bancos[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Bancos>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Bancos) {
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
