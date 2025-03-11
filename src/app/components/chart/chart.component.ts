import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TrainingService } from 'src/app/services/training.service';

// For ng2-charts / chart.js
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  user: any;          // current user info from Auth
  isLoading: boolean; // to show/hide a spinner if desired
  date: Date = new Date();

  // ----- PIE CHART (Manager/Leader) -----
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true
  };
  pieChartData: ChartData<'pie'> = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ['rgb(95, 216, 100)', 'rgb(230, 80, 80)']
      }
    ]
  };

  // ----- BAR CHART (Admin) -----
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
          text: 'Supervisor'
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
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    // Subscribe to get the current user
    this.authService.getUser$().subscribe(u => {
      this.user = u;
      if (!u) {
        console.warn("No user loaded or not logged in.");
        this.isLoading = false;
        return;
      }

      // If admin -> show bar chart
      if (u.role === 'admin') {
        this.loadBarChartForAdmin();
      }
      // If manager or leader -> show existing pie chart
      else if (u.role === 'manager' || u.role === 'leader') {
        this.loadPieChartForManager();
      }
      // Otherwise, do nothing or show a message
      else {
        this.isLoading = false;
      }
    });
  }

  // Load bar chart data for admin
  loadBarChartForAdmin(): void {
    this.trainingService.getManagersProgress().subscribe({
      next: (result) => {
        // result is an array: [ { supervisorName: string, percentCompleted: number }, ... ]
        const labels = result.map(item => item.supervisorName);
        const completedValues = result.map(item => item.percentCompleted);
    

        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = completedValues; // "Percent Completed"
         // "GOAL"

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading manager progress:", err);
        this.isLoading = false;
      }
    });
  }

  // Load existing pie chart for manager/leader
  loadPieChartForManager(): void {
    // If you have trainingService.average, etc. 
    // Wait a moment or recalc as needed:
    setTimeout(() => {
      const avg = this.trainingService.average || 0;
      const completed = parseFloat(avg.toFixed(1));
      const remaining = 100 - completed;

      this.pieChartData.datasets[0].data = [completed, remaining];
      this.isLoading = false;
    }, 500);
  }
}
