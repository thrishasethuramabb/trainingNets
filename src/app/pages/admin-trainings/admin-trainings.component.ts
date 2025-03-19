import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TrainingService } from 'src/app/services/training.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { addTraining } from './../../models/addTraining.model';

@Component({
  selector: 'app-admin-trainings',
  templateUrl: './admin-trainings.component.html',
  styleUrls: ['./admin-trainings.component.scss'],
  providers: [DecimalPipe],
})
export class AdminTrainingsComponent implements OnInit {

  // NEW: For focusing the barcode input
  @ViewChild('barcodeInput') barcodeInput: ElementRef;

  trainingStatus = [];
  selectedTraining = [];
  space = ' ';
  date;
  month;
  loading: boolean = false;
  isEditable = false;
  classList = ['toggler-wrapper', 'style-1'];
  loading2: boolean;
  isSaved = false;
  isEdited = false;
  isOpen = false;
  months = [
    'None','January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  updatingTraining;
  departments = [{
    intDepartmentId: 0,
    strDepartmentName: 'All',
    bitIsActive: true,
  }];
  addTraining: addTraining = {
    name: '',
    duration: 0,
    frequency: 0,
    departments: [],
    departmentIds: [],
    isActive: true,
    isSpecial: false,
    date: new Date()
  };
  dueMonth: number;
  editTrainingModel: addTraining = {
    name: '',
    duration: 0,
    frequency: 0,
    departments: [],
    departmentIds: [],
    isActive: true,
    isSpecial: false,
    date: new Date()
  };

  DateSelected: any;

  isActiveOptions = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false }
  ];

  // For searching
  filtered: Observable<any>;
  filteredEmp: Observable<any>;
  filter = new FormControl('', { nonNullable: true });
  empFilter = new FormControl('', { nonNullable: true });

  constructor(
    private modalService: NgbModal,
    private pipe: DecimalPipe,
    private trainingService: TrainingService,
    private employeeService: EmployeeService,
    public toastr: ToastrService,
    public auth: AuthService,
    public departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.getTrainings();
    this.date = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.getActiveDepartments(); // Ensure departments are fetched

    // Fix the search filter for trainings
    this.filtered = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.search(text, this.pipe))
    );

    // Fix the search filter for employees
    this.filteredEmp = this.empFilter.valueChanges.pipe(
      startWith(''),
      map((text) => this.searchEmp(text, this.pipe))
    );
  }

  // ============ Searching the trainings array ============
  search(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return this.trainingStatus.filter((training) => {
      return (
        training.trainingName?.toLowerCase().includes(term) ||
        training.employeeName?.toLowerCase().includes(term) ||
        (training.isActive ? 'Active' : 'Inactive').toLowerCase().includes(term) ||
        (training.isComplete ? 'Complete' : 'Incomplete').toLowerCase().includes(term)
      );
    });
  }

  // ============ Searching inside the selectedTraining array ============
  searchEmp(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return this.selectedTraining.filter(emp => {
      const date = emp.completionDate ? new Date(emp.completionDate) : new Date();
      
      return (
        emp.employeeName?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term) ||
        (emp.isComplete ? 'complete' : 'incomplete').toLowerCase().includes(term) ||
        new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        }).format(date).toLowerCase().includes(term)
      );
    });
  }

  // ============ Opens the "Add Training" modal ============
  openAdd(addTraining) {
    this.modalService.open(addTraining, { size: 'lg', centered: true });
  }

  // ============ Opens the "Training Details" modal ============
  open(content, training) {
    if (!training || !training.trainingId) {
      console.error('No training data found for this record:', training);
      this.toastr.error('No training data found for this record');
      return;
    }
  
    this.trainingService.getTrainingById(training.trainingId).subscribe(
      (response) => {
        const trainingData = Array.isArray(response) ? response[0] : response;
  
        if (trainingData && trainingData.employees && trainingData.employees.length > 0) {
          this.selectedTraining = trainingData.employees.map(emp => {
            // 1) If there's a date string, parse it to Date
            // 2) Then convert it to the "yyyy-MM-dd" string format
            let isoString = '';
            if (emp.completionDate) {
              const parsedDate = new Date(emp.completionDate);
              if (!isNaN(parsedDate.getTime())) {
                isoString = parsedDate.toISOString().split('T')[0];
              }
            }
  
            return {
              intEmployeeId:    emp.employeeId,
              intTrainingId:    trainingData.intTrainingId,
              bitIsComplete:    emp.isComplete,        // unify to "bitIsComplete"
              dtCompletionDate: isoString,             // store final "yyyy-MM-dd" here
              employeeName:     emp.employeeName,
              department:       emp.department
            };
          });
  
        } else {
          console.error('No employees found in trainingData:', trainingData);
          this.selectedTraining = [];
          this.toastr.error('No training data found for this record');
        }
        this.modalService.open(content, { size: 'lg', centered: true });
      },
      (error) => {
        console.error('API error for getTrainingById:', error);
        this.toastr.error('Error fetching training data.');
      }
    );
  }
  

  // ============ Opens the "Edit Training" modal ============
  openEditModal(editContent, training) {

    if (!training || !training.trainingId) {
      this.toastr.error('No training data found for this record');
      return;
    }

    this.trainingService.getTrainingById(training.trainingId).subscribe(
      (data) => {

        const trainingData = Array.isArray(data) ? data[0] : data;

        if (trainingData) {
          this.updatingTraining = trainingData;
          this.editTrainingModel.isActive   = trainingData.bitTrainingIsActive;
          this.editTrainingModel.name       = trainingData.strTrainingName;
          this.editTrainingModel.duration   = trainingData.intTrainingDuration;
          this.editTrainingModel.frequency  = trainingData.intTrainingFrequency;

          this.dueMonth = trainingData.dtTrainingDate
            ? new Date(trainingData.dtTrainingDate).getMonth() + 1
            : 0;

          this.editTrainingModel.departmentIds = trainingData.trainingDepartment
            ? trainingData.trainingDepartment.map((dept) => ({
                intDepartmentId:   dept.tblDepartment?.intDepartmentId,
                strDepartmentName: dept.tblDepartment?.strDepartmentName
              }))
            : [];

          this.modalService.open(editContent, { size: 'lg', centered: true });
        } else {
          this.toastr.error('No training data found for this record');
        }
      },
      (error) => {
        console.error('API error for openEditModal():', error);
        this.toastr.error('Error fetching training data for editing.');
      }
    );
  }

  // ============ Closes any modal ============
  close() {
    this.isEditable = false;
    this.isOpen = false;
    this.removeClass();
    this.modalService.dismissAll();
    if (this.isEdited && this.isSaved) {
      location.reload();
      this.isSaved = false;
      this.isEdited = false;
    }
  }

  // ============ Toggle “editable” mode ============
  editable(training) {
    let trainingDate = training?.trainingDate || training?.tbltraining?.dtTrainingDate;
    if (trainingDate) {
      const date = new Date(trainingDate);
      const current = new Date();
      if (date <= current) {
        this.isEditable = true;
        this.addClass();
        this.toastr.success("The form is now editable");
        this.isEdited = true;
      } else {
        this.isEditable = false;
        this.toastr.warning("You cannot edit future trainings!");
      }
    } else {
      this.toastr.error("Training date information is missing.");
    }
  }

  // ============ Saves the updated data for employees in the selected training ============
  save(training) {
    this.isSaved = true;
    this.loading2 = true;
    this.isEditable = false;
    this.removeClass();

    // The array is this.selectedTraining, which now has bitIsComplete and dtCompletionDate
    const payload = this.selectedTraining.map(emp => ({
      intEmployeeId:    emp.intEmployeeId,
      intTrainingId:    emp.intTrainingId,
      bitIsComplete:    emp.bitIsComplete,
      dtCompletionDate: emp.dtCompletionDate
    }));

    this.trainingService.updateStatus(payload).subscribe(
      (data) => {
        this.toastr.success("Successfully updated the training status!");
        this.loading2 = false;
      },
      (err) => {
        this.toastr.error("Could not save the changes!");
        this.loading2 = false;
      }
    );
  }

  // ============ Adds CSS class to checkboxes ============
  addClass() {
    this.classList = [...this.classList, "enable"];
  }

  // ============ Removes CSS class from checkboxes ============
  removeClass() {
    this.classList = ["toggler-wrapper", "style-1"];
  }

  // ============ Get list of active departments ============
  getActiveDepartments() {
    this.departmentService.getActiveDepartments().subscribe(
      (data) => {
        this.departments = [...data];
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  // ============ Add a new training ============
  addNewTraining(addForm: NgForm) {
    this.loading2 = true;
    if (addForm.valid) {
      if (this.dueMonth === 0) {
        // This training can be done throughout the year
        this.addTraining.date = new Date('01/01/2000');
      } else {
        this.addTraining.date = new Date(`${this.dueMonth}/01/${new Date().getFullYear()}`);
      }

      this.addTraining.isSpecial = true;
      this.addTraining.departments.forEach(({strDepartmentName}) => {
        if (strDepartmentName === 'All') {
          this.addTraining.isSpecial = false;
          this.addTraining.departments = [];
        }
      });


      this.trainingService.addNewTraining(this.addTraining).subscribe(
        (data) => {
          this.isEdited = true;
          this.isSaved = true;
          this.loading2 = false;
          this.toastr.success("Successfully added the new training!");
          addForm.resetForm();
        },
        (err) => {
          if (typeof(err.error) === 'string') {
            this.toastr.error(err.error);
          } else {
            this.toastr.error("Could not add the training!");
          }
          this.loading2 = false;
        }
      );
    } else {
      this.toastr.error("Please fill out all the required fields!");
      this.loading2 = false;
    }
  }

  // ============ Edit (update) an existing training ============
  updateTraining(editForm: NgForm) {
    this.loading2 = true;
    if (editForm.valid) {
      // If you need to update the date, do it here or via a dedicated date input
      this.editTrainingModel.isSpecial =
        this.editTrainingModel.departmentIds &&
        this.editTrainingModel.departmentIds.length > 0 &&
        !this.editTrainingModel.departmentIds.includes(0);

      this.trainingService.editTraining(this.editTrainingModel, this.updatingTraining.intTrainingId)
        .subscribe(
          (data) => {
            this.isEdited = true;
            this.isSaved = true;
            this.toastr.success("Successfully updated the training!");
            this.loading2 = false;
          },
          (err) => {
            if (typeof(err.error) === 'string') {
              this.toastr.error(err.error);
            } else {
              this.toastr.error("Could not update the training!");
            }
            this.loading2 = false;
          }
        );
    } else {
      this.toastr.error("Please fill out all the required fields!");
      this.loading2 = false;
    }
  }

  // ============ Reset training statuses ============
  resetTraining(training) {
    this.trainingService.resetTraining(training.intTrainingId).subscribe(
      (data) => {
        this.toastr.success("Successfully reset the training!");
      },
      (err) => {
        if (typeof(err.error) === 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error("Could not reset the training!");
        }
      }
    );
  }

  // ============ Load all active trainings for admin ============
  getTrainings() {
    this.loading = true;
    this.trainingService.getActiveTrainings().subscribe(
      (data) => {

        if (data && Array.isArray(data)) {
          this.trainingStatus = data.map((training) => ({
            trainingId:   training.trainingId,
            trainingName: training.trainingName,
            isActive:     training.isActive ? 'Active' : 'Inactive',
            trainingDate: new Date(training.trainingDate),
            isSpecial:    training.isSpecial,
            duration:     training.intTrainingDuration ?? 0,
            frequency:    training.frequency ?? 0,
            completed:    [],
            status:       []
          }));
        } else {
          console.error('Unexpected response format', data);
          this.trainingStatus = [];
        }

        // Trigger search filter updates
        this.filtered = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text, this.pipe))
        );

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching trainings: ', error);
        this.trainingStatus = [];
        this.loading = false;
      }
    );
  }

  // ============ 1) Open the small “Scan Barcode” sub-modal ============
  openBarcodeScanModal(content: any) {
    const modalRef = this.modalService.open(content, { size: 'sm', centered: true });
    modalRef.result.finally(() => {
      // do nothing special
    });

    // Focus the barcode input after a short delay
    setTimeout(() => {
      this.barcodeInput?.nativeElement?.focus();
    }, 200);
  }

  // ============ 2) On pressing Enter in the text input (barcode) ============
  onBarcodeEnter(event: any): void {
    const inputEl = event.target as HTMLInputElement;
    const scannedValue = inputEl.value.trim();
    if (!scannedValue) return;

    // Clear the input
    inputEl.value = '';

    // Look up the employee by this barcode
    this.auth.getUser$().subscribe(); // optional if you need user info
    this.employeeService.getByBarcode(scannedValue).subscribe(
      (employee) => {
        if (!employee) {
          this.toastr.error('No employee found for this barcode!');
          return;
        }
        // Mark them complete
        this.markTrainingCompleteForEmployee(employee);
      },
      (error) => {
        console.error('Error looking up employee by barcode:', error);
        this.toastr.error('Failed to look up employee by barcode.');
      }
    );
  }

  // ============ 3) Mark the training complete for that employee ============
  markTrainingCompleteForEmployee(employee: any) {
    // Use the first item in selectedTraining to get the trainingId, or from updatingTraining
    if (!this.selectedTraining || this.selectedTraining.length === 0) {
      this.toastr.error('No training loaded. Cannot mark complete.');
      return;
    }
    const theTrainingId = this.selectedTraining[0].intTrainingId;

    const payload = [{
      intEmployeeId:   employee.intEmployeeId,
      intTrainingId:   theTrainingId,
      bitIsComplete:   true,
      dtCompletionDate: new Date()
    }];

    this.trainingService.updateStatus(payload).subscribe(
      (res) => {
        this.toastr.success(`Marked training complete for ${employee.strEmployeeFirstName}.`);
        // Optionally reflect in UI
        const found = (this.selectedTraining || [])
          .find(e => e.intEmployeeId === employee.intEmployeeId);
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
