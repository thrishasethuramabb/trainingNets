import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { addDepartment, editDepartment } from '../models/addDepartment.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;


  getActiveDepartments():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Department/active");

  }

  getDepartmentStatus():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Department/all/status");
  }

  getAllDepartments():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Department/all");
  }
  addNewDepartment(department:addDepartment):Observable<any>{
    return this.http.post<any>(this.baseApiUrl+"/api/Department/new", department);

}
  editDepartment(department:editDepartment, id:number){
  var req = {department, id}
  return this.http.put<any>(this.baseApiUrl+`/api/Department/${id}`, department);

}
/*editDepartment(department:editDepartment, id:number){
  var req = {department, id}
  return this.http.put<any>(this.baseApiUrl+`/api/Department/deactivate/${id}`, department);

}*/
}
