import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  upcomings: any[] = [];  // Initialize as an empty array
  date = new Date();

  constructor(private trainingService: TrainingService, public toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUpcomingTrainings();
  }

  getUpcomingTrainings() {
    this.trainingService.getActiveTrainings().subscribe(
      (data) => {
        const now = new Date();
        // Use the correct property name: training.trainingDate
        this.upcomings = data.filter(training => new Date(training.trainingDate) > now);
      },
      (err) => {
        console.error('Error fetching upcoming trainings:', err);
      }
    );
  }
  
  
}
