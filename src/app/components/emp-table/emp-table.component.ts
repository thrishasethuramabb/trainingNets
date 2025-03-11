import { Component, OnInit, DoCheck, AfterViewInit, AfterContentInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-emp-table',
  templateUrl: './emp-table.component.html',
  styleUrls: ['./emp-table.component.scss']
})
export class EmpTableComponent implements OnInit {

  date= new Date()
  trainings =[];
  isEditable=false;
  classList=["toggler-wrapper", "style-1"]
  status=[];
  loading:boolean = false;

  constructor(public trainingService: TrainingService, public toastr: ToastrService) { }
  ngOnInit(): void {
  }

  editable(){
    this.isEditable=true;
    this.addClass();
    this.toastr.warning("The form is now editable")
  }

  save() {
    this.loading = true;
    this.isEditable = false;
    this.removeClass();
  
    // Reset status array
    this.status = [];
    // Loop through trainings and collect statuses from either 'status' or 'Status'
    this.trainingService.trainings.forEach(training => {
      const statuses = training.status || training.Status || [];
      this.status.push(...statuses);
    });
  
    this.trainingService.updateStatus(this.status).subscribe(
      (data) => {
        this.toastr.success("Successfully updated the training status!");
        location.reload();  // Consider a more Angular-friendly update in the future
        this.loading = false;
      },
      (err) => {
        this.toastr.error(err.error);
        this.loading = false;
      }
    );
  }
  

  addClass(){
    this.classList=[...this.classList, "enable"]
  }

  removeClass(){
    this.classList=["toggler-wrapper", "style-1"]
  }


}
