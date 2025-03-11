import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatIconModule} from '@angular/material/icon'
import { CarouselComponent } from './components/carousel/carousel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { TableComponent } from './components/table/table.component';
import { EmpTableComponent } from './components/emp-table/emp-table.component';
import { TrainingsComponent } from './pages/trainings/trainings.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { TrainingService } from './services/training.service';
import { EmployeeService } from './services/employee.service';
import { ManageComponent } from './pages/manage/manage.component';
import { AdminTrainingsComponent } from './pages/admin-trainings/admin-trainings.component';
import { AdminEmployeesComponent } from './pages/admin-employees/admin-employees.component';
import { DepartmentService } from './services/department.service';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


export function tokenGetter() {
  return localStorage.getItem("token");
}

 @NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    CarouselComponent,
    DashboardComponent,
    ChartComponent,
    TableComponent,
    EmpTableComponent,
    TrainingsComponent,
    EmployeesComponent,
    ManageComponent,
    AdminTrainingsComponent,
    AdminEmployeesComponent,
    DepartmentsComponent,


  ],
  imports: [

BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserModule,
BrowserAnimationsModule,
NoopAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    CommonModule,
    NgbModule,
    NgChartsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        //allowedDomains: ["localhost:7095"],
        
        allowedDomains: ["10.90.104.34:7140", "10.90.102.173:8085"],
        disallowedRoutes: []
      }


    }),

    MatIconModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass:'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
    }),


  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,


  }, AuthService, TrainingService, EmployeeService, DepartmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
