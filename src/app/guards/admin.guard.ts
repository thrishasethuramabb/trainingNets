import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private router:Router,  public auth: AuthService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.auth.getMe().pipe(map(user=>{
            if( user?.role==='admin'){
              return true;
            }else{
                this.router.navigateByUrl("")
                return false;
            }
      }),catchError(() => {
           this.router.navigateByUrl("/login")
           return of(false)
         }))
  }

}
