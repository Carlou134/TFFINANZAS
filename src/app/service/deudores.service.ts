import { Deudores } from './../models/Deudores';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class DeudoresService {
  private url = `${base_url}/deudores`;
  private listaCambio = new Subject<Deudores[]>();

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
    return this.http.get<Deudores[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: Deudores) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: Deudores[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Deudores>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Deudores) {
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
