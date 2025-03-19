import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/Login.model';
import { UserInfo } from '../models/UserInfo.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl: string = environment.baseApiUrl;
  private isAuthorized$ = new BehaviorSubject<boolean>(false);
  private user$ = new BehaviorSubject<UserInfo>(null);
  token: string;
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private route: Router) { }

  public getToken(): string {
    return localStorage.getItem("token");
  }
  public getCurrentUser(): any {
    return this.user$.value;
  }
  
  getUser$() {
    return this.user$.asObservable();
  }

  getLoading() {
    return this.loading$.asObservable();
  }

  getIsAuthorize() {
    return this.isAuthorized$.asObservable();
  }

  getUser() {
    var token = this.getToken();
    if (!token) {
      return;
    }

    this.loading$.next(true);
    this.getMe().subscribe(
      (data) => {
        this.loading$.next(false);
        this.setUser(data);
      },
      (err) => {
        this.loading$.next(false);
      }
    );
  }

  setUser(user) {
    this.user$.next(user);
    this.isAuthorized$.next(true);
  }

  logout() {
    localStorage.removeItem("token");
    this.user$.next(null);
    this.isAuthorized$.next(false);
  }

  public signup(user: User): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + '/api/Auth/signup', user);
  }

  public login(login: Login): Observable<any> {
    return this.http.post<any>(this.baseApiUrl + "/api/Auth/login", 
    login
    ).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem("token", response.token); // Store token
        }
      })
    );
  }

  public getMe(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + "/api/Auth/me",   {headers:new HttpHeaders({'Access-Control-Allow-Origin': '*', 'withCredentials': 'true'})}, ).pipe(
      tap(data => {
      })
    );
  }

  loginWithBarcode(barcode: string) {
    return this.http.post<any>(`${environment.baseApiUrl}/api/Auth/loginWithBarcode`, { Barcode: barcode });
  }
  
  
  public getDepartments(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + "/api/Department");
  }
  public getCurrentDepartment(): number | null {
    const user = this.user$.value;
    return user && user.departmentId ? user.departmentId : null;
  }
  
  
  public deactivateLeader(employee): Observable<any> {
    return this.http.put<any>(this.baseApiUrl + "/api/Auth/deactivate", employee);
  }

  public activateLeader(employee): Observable<any> {
    return this.http.put<any>(this.baseApiUrl + "/api/Auth/activate", employee);
  }

  // Added isAdmin method to check if the current user is an admin.
  isAdmin(): boolean {
    const user = this.user$.value;
    // Adjust 'role' if your UserInfo uses a different property name.
    return user && user.role && user.role.toLowerCase() === 'admin';
  }
}
