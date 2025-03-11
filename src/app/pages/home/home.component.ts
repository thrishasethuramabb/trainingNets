import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from 'src/app/services/training.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  
  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    public trainingService: TrainingService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getUser$().subscribe(u => {
      if (u) {
        console.log("User Role:", u.role);
        if (u.role === 'manager' || u.role === 'leader') {
          this.trainingService.getActiveTrainings().subscribe(
            (data) => {
              console.log("Manager trainings data:", data);
              this.trainingService.trainings = data;
              this.trainingService.loading = false;
            },
            (err) => {
              console.error("Error fetching manager training data:", err);
              this.trainingService.loading = false;
            }
          );
        }
        else if (u.role === 'admin') {
          console.log("Fetching training data for admin...");
          // For admin, use the current department endpoint or getActiveTrainings as needed
          this.trainingService.getCurrentDepartment();
        } else {
          console.log("Non-admin role: fetching current trainings.");
          this.trainingService.getCurrent();
        }
      } else {
        console.log("User is not defined");
      }
    },
    (error) => {
      console.error("Error fetching user data:", error);
    });
  }
  
  exportData(): void {
    if (this.startDate && this.endDate) {
      this.employeeService.exportData(this.startDate, this.endDate).subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'TrainingData.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (err) => {
          if (typeof err.error === 'string') {
            this.toastr.error(err.error);
          } else {
            this.toastr.error("Could not export the data!");
          }
        }
      );
    } else {
      this.toastr.error('Please select both start and end dates.');
    }
  }
}
