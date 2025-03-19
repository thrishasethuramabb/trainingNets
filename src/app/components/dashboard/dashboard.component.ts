import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  date = new Date();
  trainings: any[] = [];

  constructor(public trainingService: TrainingService, public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getUser$().subscribe(user => {
      if (user) {
        if (user.role === 'manager') {
          const managerDeptId = user.departmentId;
          this.trainingService.getActiveTrainings().subscribe(data => {
            // Filter trainings for manager’s department
            this.trainings = data.filter(training =>
              training.status?.some(statusItem => statusItem.tblEmployee?.departmentId === managerDeptId)
            );
          });
        } else {
          // For admin or other roles, assign all trainings (or apply different filtering)
          this.trainingService.getActiveTrainings().subscribe(data => {
            this.trainings = data;
          });
        }
      }
    });
  }
}
