import { DoCheck, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private jwtHelper: JwtHelperService, private router: Router, private auth: AuthService) {
  }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const token=localStorage.getItem("token");

      if(token && this.jwtHelper.isTokenExpired(token)){
        this.router.navigate(["/login"])
        return false;

      }

      return this.auth.getMe().pipe(map(user=>{
            if(user){
                return true;
            }else{
                this.router.navigateByUrl("/login")
                return false;
            }
      }),catchError(() => {
           this.router.navigateByUrl("/login")
           return of(false)
         }))
  }

}
