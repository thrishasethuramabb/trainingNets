import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CardData } from 'src/app/models/CardData.model';
import { TrainingService } from 'src/app/services/training.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('cardFlip', [
      state('default', style({ transform: 'none' })),
      state('flipped', style({ transform: 'rotateY(180deg)' })),
      transition('default => flipped', [ animate('400ms') ]),
      transition('flipped => default', [ animate('200ms') ])
    ])
  ]
})
export class CarouselComponent implements OnInit {
  currentUser: any;
  @Input() trainings: any[] = [];
  images = [
    "../../../assets/images/hse1.jpg",
    "../../../assets/images/hse2.jpg"
  ];
  chartData: any;
  chartLabels: any;
  chartOptions: any;
  // Data for flip animation
  data: CardData = {
    imageId: "pDGNBK9A0sk",
    state: "default"
  };
 // Mapping training names to their course URLs.
 private trainingLinks: { [name: string]: string } = {
  "Bloodborne Pathogens": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/bbp-1.3/US&_=1a1c151c-0249-479f-975d-b6907a0825bc&company=demo&mode=demo&limit=1000",
  "Hazard Communication": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/hzc-1.3/US&_=02f8bb5e-a2d3-42e9-8c3f-e8dd3795510d&company=demo&mode=demo&limit=1000",
  "Electrical Safety / Warehouse Safety": "https://www.youtube.com/watch?v=wal2KP1bbIY",
  "Warehouse Safety": "https://abb.safetyhub.com/category/all/?region=uk",
  "Emergency Response": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/emr-1.3/US&_=bede1032-9fa1-4ecd-af99-d6d244596d6b&company=demo&mode=demo&limit=1000",
  "Universal Waste Management": "https://abb.safetyhub.com/category/all/?region=uk",
  "Industrial Ergonomics": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/erg-1.3/US&_=98133844-99a1-444c-86ff-3dba46d067e9&company=demo&mode=demo&limit=1000",
  "Office Ergonomics": "https://hero.blr.com/uploads-virtual/Audio/EHS/safety/10005200/player.html",
  "Back Injury Prevention": "https://abb.safetyhub.com/embeddirect/LARRIELW/35442",
  "Hand and Power Tool Safety": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/ppe-2.3/US&_=514f47b9-3354-42ec-b456-411a5cd00c73&company=demo&mode=demo&limit=1000",
  "Pollution Prevention Initiatives": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/p21-1.3/US&_=08986b46-6597-478d-816b-cb054c740230&company=demo&mode=demo&limit=1000",
  "Materials Handling": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/mat-1.3/US&_=dd754182-5c16-4439-80ee-77b2e28d6b17&company=demo&mode=demo&limit=1000",
  "Accident Prevention Signs and Tags": "",
  "Resilience": "https://www.linkedin.com/learning/building-resilience/build-a-resilience-threshold",
  "Personal Protective Equipment": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/ppe-1.3/US&_=265c5447-e685-487d-9285-e49e7cfbc8ae&company=demo&mode=demo&limit=1000",
  "Fire Safety": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/frs-1.3/US&_=f20c4ada-5a1c-462d-bf33-95033067a72b&company=demo&mode=demo&limit=1000",
  "Slips, Trips, and Falls": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/stf-1.3/US&_=3774927d-3dd8-48ea-b008-94d672bd816f&company=demo&mode=demo&limit=1000",
  "Security Threat Awareness": "https://cdn.safetyskills.com/courses-able/able-v2.htm?scoRoot=courses/sec-1.3/US&_=6c4a5607-1ed6-4be8-8727-5b55c77928dc&company=demo&mode=demo&limit=1000"
};


  constructor(
    private config: NgbCarouselConfig,
    public trainingService: TrainingService,
    public toastr: ToastrService,
    public auth: AuthService
  ) {
    this.chartOptions = { responsive: true };
  }

  ngOnInit(): void {
    this.config.interval = 10000;
    this.config.wrap = true;
    this.config.keyboard = false;
    this.config.pauseOnHover = false;
  
    // Wait until we have a user with a valid role, then proceed.
    this.auth.getUser$().subscribe(user => {
      this.currentUser = user;
      if (!user) return;
  
      if (user.role === 'admin') {
        this.trainingService.getActiveTrainings().subscribe(data => {
          this.trainings = data;
          this.populateChart();
        });
      } 
      else if (user.role === 'manager' || user.role === 'leader') {
        // Only proceed once we actually have a departmentId
        if (!user.departmentId) {
          console.error("Manager department not found!");
          return;
        }
        this.trainingService.getActiveTrainings().subscribe(data => {
          this.trainings = data.filter(training =>
            training.status &&
            training.status.some((s: any) =>
              s.tblEmployee && s.tblEmployee.departmentId === user.departmentId
            )
          );
          this.populateChart();
        });
      } 
      else {
        // For other roles
        this.trainingService.getActiveTrainings().subscribe(data => {
          this.trainings = data;
          this.populateChart();
        });
      }
    });
  }

  cardClicked() {
    this.data.state = this.data.state === "default" ? "flipped" : "default";
  }

  getTrainingName(training: any): string {
    if (training.training && training.training.strTrainingName) {
      return training.training.strTrainingName;
    }
    return training.TrainingName ||
           training.trainingName ||
           training.strTrainingName ||
           'No Training Name';
  }

  // For managers, only consider statuses where the employee belongs to the same department.
  getCompleted(training: any): any[] {
    const statusArray = training.status || [];
    if (this.currentUser && this.currentUser.departmentId) {
      return statusArray.filter(item => item.isComplete === true &&
          item.tblEmployee && item.tblEmployee.departmentId === this.currentUser.departmentId);
    }
    return statusArray.filter(item => item.isComplete === true);
  }

  getIncomplete(training: any): any[] {
    const statusArray = training.status || [];
    if (this.currentUser && this.currentUser.departmentId) {
      return statusArray.filter(item => item.isComplete === false &&
          item.tblEmployee && item.tblEmployee.departmentId === this.currentUser.departmentId);
    }
    return statusArray.filter(item => item.isComplete === false);
  }

  getCompletedCount(training: any): number {
    return this.getCompleted(training).length;
  }

  getTotalCount(training: any): number {
    const statusArray = training.status || [];
    if (this.currentUser && this.currentUser.departmentId) {
      return statusArray.filter(item =>
          item.tblEmployee && item.tblEmployee.departmentId === this.currentUser.departmentId
      ).length;
    }
    return statusArray.length;
  }
  getTrainingLink(training: any): string {
    return this.trainingLinks[this.getTrainingName(training)] || "";
  }

  populateChart() {
    this.chartLabels = [];
    this.chartData = [];
    if (!this.trainings || this.trainings.length === 0) {
      console.warn("No training data available for chart.");
      return;
    }
    for (let tr of this.trainings) {
      if (tr.DepartmentName) {
        this.chartLabels.push(tr.DepartmentName);
      } else if (tr.training && tr.training.strTrainingName) {
        this.chartLabels.push(tr.training.strTrainingName);
      } else if (tr.trainingName) {
        this.chartLabels.push(tr.trainingName);
      } else {
        console.warn('Missing department or training name for training:', tr);
      }
    }
    // Example static chart data – update as needed.
    this.chartData = [
      { data: ["23", "45", "45", "99"], label: "Fire Safety" },
      { data: ["23", "45", "45", "34"], label: "Emergency Response" }
    ];
  }
}
