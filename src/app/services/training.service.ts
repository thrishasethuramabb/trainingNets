import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, DoCheck } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { addTraining } from '../models/addTraining.model';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrainingService{

 baseApiUrl: string = environment.baseApiUrl;
  currentTrainings=[];
  trainings=[];
  average:number;
  loading:boolean = false;
  private trainingsSubject = new BehaviorSubject<any[]>([]);
  trainings$ = this.trainingsSubject.asObservable();

  constructor(private http: HttpClient, public toastr: ToastrService) { }

  getCurrent(){
    this.loading=true;
    this.getCurrentTrainings().subscribe(
      (data)=>{
        this.trainings=[ ...data];

        if(this.trainings!=null){
          var count =0;
          var sum =0;
          this.trainings?.forEach(tr=>{
            count++;
            sum+= (tr.completed.length/tr.status.length)*100;
          })

          if(sum==0||count==0){
              this.average=0;
            }else{
            this.average=sum/count;
          }

        }

        this.loading=false;
      },
      (err)=>{
        if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not load the trainings!")
        }

        this.loading=false;


      }
    )
  }


  
  getCurrentDepartment() {
    this.loading = true;
    console.log("Fetching current department trainings...");
    
    this.getDepartmentCurrentStatus().subscribe(
      (data) => {
        console.log("Received API response:", data);
  
        // Ensure the response contains expected values
        if (data && Array.isArray(data)) {
          this.trainings = data;
        } else {
          console.error("Unexpected API response format:", data);
          this.trainings = [];
        }
  
        this.loading = false;
        console.log("Final Trainings Data:", this.trainings);
      },
      (err) => {
        console.error("Error fetching department training data:", err);
        this.toastr.error("Failed to fetch department training data");
        this.loading = false;
      }
    );
  }
  



  getManagersProgress(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/api/Training/managers-progress`);
  }
  
 

  getTrainingById(trainingId: number) {
     
  const API_BASE_URL = 'http://localhost:8083/api/Training'; // Use the correct backend URL
    return this.http.get<any>(`${API_BASE_URL}/byId/${trainingId}`);
  }
  

  getCurrentTrainings():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Training/current");

  }

  getUpcomingTrainings(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + "/api/Training/upcoming")
      .pipe(
        map(data => data || [])
      );
  }

  updateStatus(emp):Observable<any>{
    return this.http.put<any>(this.baseApiUrl+ "/api/Training/update", emp);
  }

  getActiveTrainings(): Observable<any> {
    console.log("Calling API: " + this.baseApiUrl + "/api/Training/active");
    return this.http.get<any>(this.baseApiUrl + "/api/Training/active").pipe(
      tap(data => {
        this.trainingsSubject.next(data);
      })
    );
  }

  
  
  getActiveDepartments(): Observable<any> {
    console.log("Calling API: /api/Department/active");
    return this.http.get<any>(this.baseApiUrl + "/api/Department/active");
  }
  getDepartmentCurrentStatus():Observable<any>{
    return this.http.get<any>(this.baseApiUrl+"/api/Department/current/status");
  }

  addNewTraining(training:addTraining):Observable<any>{
    
        return this.http.post<any>(this.baseApiUrl+"/api/Training/new", training);

  }

  editTraining(training: addTraining, id: number): Observable<any> {
    const req = { training, id };
    return this.http.put<any>(this.baseApiUrl + "/api/Training/edit", req);
  }
  

   resetTraining(id: number){
     return this.http.put<any>(this.baseApiUrl+"/api/Training/reset", id);
   }

}