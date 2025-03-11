// trainings.component.ts
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
  providers: [DecimalPipe],
})
export class TrainingsComponent implements OnInit {
  trainingStatus: any[] = [];
  selectedTraining: any = null;
  selectedTrainingEmployees: any[] = [];
  date: number;
  month: number;
  loading: boolean = false;
  isEditable: boolean = false;
  classList: string[] = ['toggler-wrapper', 'style-1'];
  loading2: boolean;
  isSaved: boolean = false;
  isEdited: boolean = false;

  filtered: Observable<any>;
  filter = new FormControl('', { nonNullable: true });
  empFilter = new FormControl('', { nonNullable: true });
  filteredEmp: Observable<any>;

  constructor(
    private modalService: NgbModal,
    private pipe: DecimalPipe,
    private trainingService: TrainingService,
    public toastr: ToastrService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getActiveTrainings();
    this.date = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.auth.getUser$().subscribe();
  }

  search(text: string): any[] {
    const term = text.toLowerCase();
    return this.trainingStatus.filter(training => {
      const name = (training.trainingName || '').toLowerCase();
      let dt = new Date(training.trainingDate);
      if (isNaN(dt.getTime())) { dt = new Date(); }
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dt).toLowerCase();
      return name.includes(term) || monthName.includes(term);
    });
  }

  searchEmp(text: string): any[] {
    const term = text.toLowerCase();
    return this.selectedTrainingEmployees.filter(emp => {
      const firstName = emp.tblEmployee?.strEmployeeFirstName?.toLowerCase() || '';
      const lastName = emp.tblEmployee?.strEmployeeLastName?.toLowerCase() || '';
      return firstName.includes(term) || lastName.includes(term);
    });
  }

  getActiveTrainings() {
    this.loading = true;
    this.trainingService.getActiveTrainings().subscribe(
      (data: any[]) => {
        console.log('Fetched Data:', data);
        this.trainingStatus = [...data];
        this.filtered = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text))
        );
        this.loading = false;
      },
      (err) => {
        this.toastr.error('Could not load the trainings!');
        this.loading = false;
      }
    );
  }

  open(content: any, training: any) {
    this.selectedTraining = training;
    // Use either Status (manager) or status (admin) property
    this.selectedTrainingEmployees = training.Status || training.status || [];
    this.filteredEmp = this.empFilter.valueChanges.pipe(
      startWith(''),
      map(text => this.searchEmp(text))
    );
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  close() {
    this.isEditable = false;
    this.removeClass();
    this.modalService.dismissAll();
    if (this.isEdited && this.isSaved) {
      location.reload();
      this.isSaved = false;
      this.isEditable = false;
    }
  }

  editable() {
    const dt = this.selectedTraining?.trainingDate ? new Date(this.selectedTraining.trainingDate) : new Date();
    if (dt.getMonth() + 1 <= this.month) {
      this.isEditable = true;
      this.addClass();
      this.toastr.success('The form is now editable');
      this.isEdited = true;
    } else {
      this.isEditable = false;
      this.toastr.warning('You cannot edit the future training!');
    }
    console.log(this.selectedTraining);
  }

  save() {
    this.isSaved = true;
    this.loading2 = true;
    this.isEditable = false;
    this.removeClass();
    const payload = this.selectedTrainingEmployees.map(emp => ({
      intEmployeeId: emp.tblEmployee?.intEmployeeId || emp.employeeId,
      intTrainingId: this.selectedTraining.trainingId,
      bitIsComplete: emp.bitIsComplete,
      dtCompletionDate: emp.dtCompletionDate
    }));
    this.trainingService.updateStatus(payload).subscribe(
      (data) => {
        this.toastr.success('Successfully updated the training status!');
        this.loading2 = false;
        console.log('Update response:', data);
      },
      (err) => {
        this.toastr.error('Sorry, the changes could not be saved!');
        this.loading2 = false;
      }
    );
  }

  addClass() {
    this.classList = [...this.classList, 'enable'];
  }

  removeClass() {
    this.classList = ['toggler-wrapper', 'style-1'];
  }

  getCompletionPercent(training: any): number {
    const statusArr = training.Status || training.status || [];
    const completed = statusArr.filter(s => s.IsComplete || s.isComplete).length;
    return statusArr.length > 0 ? completed / statusArr.length : 0;
  }
}
