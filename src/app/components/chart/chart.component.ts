import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TrainingService } from 'src/app/services/training.service';
import { ChartOptions, ChartData } from 'chart.js';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  user: any;          // Current user info from Auth
  isLoading: boolean = true;
  date: Date = new Date();

  // ----- BAR CHART CONFIGURATION (Used for both Admin & Manager/Leader) -----
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percent Completed'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Manager'
        }
      }
    }
  };
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Percent Completed' }
    ]
  };

  constructor(
    private authService: AuthService,
    public trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    // Wait until a non-null user is emitted, then take the first value.
    this.authService.getUser$().pipe(
      filter(u => !!u),
      take(1)
    ).subscribe(u => {
      this.user = u;
      if (u.role === 'admin') {
        this.loadBarChartForAdmin();
      } else if (u.role === 'manager' || u.role === 'leader') {
        this.loadBarChartForManager();
      } else {
        this.isLoading = false;
      }
    });
  }

  // Admin side: Loads the progress data and reassigns the chart data to trigger change detection.
  loadBarChartForAdmin(): void {
    this.trainingService.getManagersProgress().subscribe({
      next: (result: any[]) => {
        const labels = result.map(item => item.managerName);
        const completedValues = result.map(item => item.percentCompleted);
        // Reassign the chart data object to force update.
        this.barChartData = {
          labels: labels,
          datasets: [
            { data: completedValues, label: 'Percent Completed' }
          ]
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading managers progress:", err);
        this.isLoading = false;
      }
    });
  }

loadBarChartForManager(): void {
  if (!this.user.departmentId) {
    console.error("Manager department not found!");
    this.isLoading = false;
    return;
  }
  const currentMonth = this.date.getMonth() + 1; // getMonth() is zero-indexed
  const currentYear = this.date.getFullYear();
  // Call the service to get department managers progress for the current month.
  this.trainingService.getDepartmentManagersProgress({ 
    departmentId: this.user.departmentId, 
    month: currentMonth, 
    year: currentYear 
  }).subscribe({
    next: (result: any[]) => {
      // Expected format: [ { managerName: string, percentCompleted: number }, ... ]
      const labels = result.map(item => item.managerName);
      const completedValues = result.map(item => item.percentCompleted);
      // Reassign the chart data object with new reference.
      this.barChartData = {
        labels: labels,
        datasets: [
          { data: completedValues, label: 'Percent Completed' }
        ]
      };
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Error Loading Department progress:", err);
      this.isLoading = false;
    }

    
  });
}

}
