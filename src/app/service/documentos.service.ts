import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Documentos } from '../models/Documentos';

const base_url = environment.base;
@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private url = `${base_url}/documentos`;
  private listaCambio = new Subject<Documentos[]>();

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
    return this.http.get<Documentos[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: Documentos) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  setList(listaNueva: Documentos[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Documentos>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Documentos) {
    return this.http.put(this.url, c, {
      headers: this.getHeaders()
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  listByCartera(idCartera: number) {
    return this.http.get<Documentos[]>(`${this.url}/listar/${idCartera}`, {
      headers: this.getHeaders()
    });
  }
}
