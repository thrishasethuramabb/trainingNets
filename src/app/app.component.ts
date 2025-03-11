import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trainingNets';

   constructor(public auth: AuthService, private route : Router, public trainingService: TrainingService ) {}

   ngOnInit(): void {
    var token = localStorage.getItem("token")
    this.auth.getUser();
    this.auth.getUser$().subscribe();
    this.auth.getIsAuthorize().subscribe();
    this.auth.getLoading().subscribe();



  }




}
