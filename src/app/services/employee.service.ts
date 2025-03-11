import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addEmployee,editEmployee } from '../models/addEmployee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
   baseApiUrl: string = environment.baseApiUrl;


  constructor(private http: HttpClient, public toastr: ToastrService) { }

  getEmployees():Observable<any>{
    const token = localStorage.getItem("token"); // Retrieve JWT token from local storage
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:8083/api/Employee/all', { headers });
  }

  getClassifications():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Employee/roles");
  }

  addNewEmployee(employee: addEmployee): Observable<any> {
    return this.http.post<any>('http://localhost:8083/api/Employee/new', employee);
}

editEmployee(employee: editEmployee, id: number): Observable<any> {
  const updatedData = { 
    ...employee, 
    intDepartmentId: employee.intDepartmentId,
    intClassificationId: employee.intClassificationId,
    isActive: employee.isActive
  };

  return this.http.put<any>(`${this.baseApiUrl}/api/Employee/${id}`, updatedData);
}

exportData(startDate: string, endDate: string): Observable<Blob> {
  let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
  return this.http.get(`${this.baseApiUrl}/api/Employee/export`, { params, responseType: 'blob' });
}

}
