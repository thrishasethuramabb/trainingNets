import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.auth.getUser$().subscribe(u=>{
    });

  }

  logout(){
    this.auth.logout();
    this.route.navigate(["/login"]);


  }

}
