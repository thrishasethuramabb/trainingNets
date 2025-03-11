import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router, private auth: AuthService) { }

  //loggedin user cannot navigate to the login page, should be redirected to the home page
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth.getMe().pipe(map(val=>{
            if(!val){
                return true;
            }else{
                this.router.navigateByUrl("")
                return false;
            }
            }),
            catchError(()=>{
                return of(true)
        }))
    }
}
