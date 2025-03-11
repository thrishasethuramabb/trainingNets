import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { TrainingsComponent } from './pages/trainings/trainings.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LoggedInGuard } from './guards/logged-in.guard';
//import { ManageComponent } from './pages/manage/manage.component';
import { AdminTrainingsComponent } from './pages/admin-trainings/admin-trainings.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminEmployeesComponent } from './pages/admin-employees/admin-employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
    canActivate:[AuthGuard]
  },
  // {path:"***", redirectTo:"", pathMatch:'full'},
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
    canActivate: [LoggedInGuard]
  },
  {
    path: "trainings",
    component: TrainingsComponent,
    pathMatch: "full",
    canActivate:[AuthGuard]
  },
  {
    path: "employees",
    component: EmployeesComponent,
    pathMatch: "full",
    canActivate:[AuthGuard]
  },
  /*{
    path:"manage",
    component: ManageComponent,
    pathMatch: "full",
    canActivate:[AuthGuard, AdminGuard]
  },*/
  {
    path:"trainingsAdmin",
    component:AdminTrainingsComponent,
    pathMatch: "full",
    canActivate:[AuthGuard, AdminGuard]
  },
  {
    path:"employeesAdmin",
    component:AdminEmployeesComponent,
    pathMatch: "full",
    canActivate:[AuthGuard, AdminGuard]
  },
  {
    path:"departments",
    component:DepartmentsComponent,
    pathMatch: "full",
    canActivate:[AuthGuard, AdminGuard]
  }



];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
