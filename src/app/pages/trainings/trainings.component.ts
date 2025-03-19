// trainings.component.ts
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TrainingService } from 'src/app/services/training.service';


@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
  providers: [DecimalPipe],
})
export class TrainingsComponent implements OnInit {
  @ViewChild('barcodeInput') barcodeInput: ElementRef;

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
    private employeeService: EmployeeService,
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
    // Store the selected training object
    this.selectedTraining = training;
  
    // The server returns an array under either `training.Status` or `training.status`
    const serverArray = training.Status || training.status || [];
  
    // Convert each server object into the shape your template wants
    this.selectedTrainingEmployees = serverArray.map(item => ({
      // For your checkboxes
      bitIsComplete: item.isComplete,            // rename "isComplete" -> "bitIsComplete"
      dtCompletionDate: item.completionDate
        ? new Date(item.completionDate)          // parse the date string
        : null,
  
      // If your template also references `.employeeId` or `.tblEmployee`, copy those too:
      employeeId: item.employeeId,
      tblEmployee: item.tblEmployee,
    }));
  
    // Setup your employee-filter (if you have a search box)
    this.filteredEmp = this.empFilter.valueChanges.pipe(
      startWith(''),
      map(text => this.searchEmp(text))
    );
  
    // Finally open the modal
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
  }

  save() {
    this.isSaved = true;
    this.loading2 = true;
    this.isEditable = false;
    this.removeClass();
  
    // Build the payload using the mapped fields
    const payload = this.selectedTrainingEmployees.map(emp => ({
      intEmployeeId: emp.employeeId,
      intTrainingId: this.selectedTraining.trainingId,
      bitIsComplete: emp.bitIsComplete,
      dtCompletionDate: emp.dtCompletionDate
    }));
  
    this.trainingService.updateStatus(payload).subscribe(
      (res) => {
        this.toastr.success('Successfully updated the training status!');
        this.loading2 = false;
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

  openBarcodeScanModal(content: any) {
    const modalRef = this.modalService.open(content, { size: 'sm', centered: true });
    modalRef.result.finally(() => {
      // do nothing special
    });

    // Focus the input after a slight delay
    setTimeout(() => {
      this.barcodeInput?.nativeElement?.focus();
    }, 200);
  }

  // 2) On pressing Enter in the text input
  // trainings.component.ts
onBarcodeEnter(event: any): void {
  // If you want typed usage, do a runtime cast inside:
  const keyboardEvent = event as KeyboardEvent;
  const inputEl = keyboardEvent.target as HTMLInputElement;

  const scannedValue = inputEl.value.trim();
  if (!scannedValue) return;

  // Clear the input
  inputEl.value = '';

  // Now do your "look up employee by barcode" logic
  this.employeeService.getByBarcode(scannedValue).subscribe(
    (employee) => {
      if (!employee) {
        this.toastr.error('No employee found for this barcode!');
        return;
      }
      this.markTrainingCompleteForEmployee(employee);
    },
    (error) => {
      console.error('Error looking up employee by barcode:', error);
      this.toastr.error('Failed to look up employee by barcode.');
    }
  );
}

  // 4) Mark the training complete for that employee
  markTrainingCompleteForEmployee(employee: any) {
    // The currently opened training detail is in `this.selectedTraining`
    if (!this.selectedTraining || !this.selectedTraining.trainingId) {
      this.toastr.error('No training selected. Cannot mark complete.');
      return;
    }

    const payload = [{
      intEmployeeId: employee.intEmployeeId,
      intTrainingId: this.selectedTraining.trainingId,
      bitIsComplete: true,
      dtCompletionDate: new Date()
    }];

    this.trainingService.updateStatus(payload).subscribe(
      (res) => {
        this.toastr.success(`Marked training complete for ${employee.strEmployeeFirstName}.`);

        // If you want to reflect in UI, find that employee in selectedTrainingEmployees array:
        const found = (this.selectedTrainingEmployees || []).find(e => e.employeeId === employee.intEmployeeId);
        if (found) {
          found.bitIsComplete = true;
          found.dtCompletionDate = new Date();
        }
      },
      (err) => {
        console.error('Error marking training complete', err);
        this.toastr.error('Failed to mark training complete');
      }
    );
  }

}
