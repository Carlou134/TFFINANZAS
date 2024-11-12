import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Role } from '../models/Role';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url = `${base_url}/roles`;
  private listaCambio = new Subject<Role[]>();

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

    // Headers sin autorización para endpoints públicos
    private getPublicHeaders(): HttpHeaders {
      return new HttpHeaders()
        .set('Content-Type', 'application/json');
    }

  list() {
    return this.http.get<Role[]>(this.url, {
      headers: this.getHeaders()
    });
  }

  insert(ca: Role) {
    return this.http.post(this.url, ca, {
      headers: this.getHeaders()
    });
  }

  // Nuevo método para registro público
  register(roles: Role): Observable<any> {
    return this.http.post(this.url, roles, {
      headers: this.getPublicHeaders()
    });
  }

  setList(listaNueva: Role[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Role>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
  }

  update(c: Role) {
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
