import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserInfo } from 'src/app/models/UserInfo.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

 classList=["container"];
 isBarCode:boolean;
 credentials={};
 openScanner: boolean;
 barcode: string;
 user:UserInfo;
 loginReq: Login ={
  username: "",
  password: ""
 }
 loading:boolean = false;


  invalidLogin: boolean;

  constructor(private router:Router, public auth: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }


  resetBarCode(){
    this.barcode="";
  }


  //adds the class to the card to open the right panel
  addClassList(){
      this.classList=[...this.classList, "right-panel-active"];
      this.isBarCode=false;
  }

  //opens the login with barcode card
  openBarCode(){
    this.classList=[...this.classList, "right-panel-active"];
    this.isBarCode=true;
  }

//removes the class to go back to left panel
  removeClass(){
    this.classList=this.classList.filter((className)=>className != "right-panel-active")
  }

  //gets the classlist for the card
  getClassList(){
    return this.classList;
  }



  login=(form: NgForm)=>{
    this.loading=true;

    if(form.valid){
      if (this.isBarCode) {
        this.auth.loginWithBarcode(this.barcode).subscribe(
          response => {
            localStorage.setItem("token", response.token);
            this.auth.setUser(response.emp);
            this.loading = false;
            this.router.navigate(["/"]);
            const fname = response.emp.name.split(" ")[0];
            this.toastr.success("Welcome Back " + fname + "!");
          },
          err => {
            this.toastr.error(err.error || "Backend Connection error");
            this.loading = false;
          }
        );
      }
      else {

      this.auth.login(this.loginReq).subscribe(
        response=>{
          //setting the jwt and role in the local storage
          localStorage.setItem("token", response.token);
          this.user=response.emp;
          //setting theuser and authorize property of auth service
        this.auth.setUser(this.user);
        this.loading=false;

        //navigate to home
        this.router.navigate(["/"]);
        var fname = this.user.name.split(" ")[0]
        this.toastr.success("Welcome Back "+fname+"!");

        },
        err=>{
          //display custom error from backend if exists
          if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Backend Connection error");
        }
        this.loading=false;


        })
    }}
    
    else{
      this.toastr.error("Please enter all the required fields!")
      this.loading=false;
    }



  }

}
