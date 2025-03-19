import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { addEmployee, editEmployee } from 'src/app/models/addEmployee.model';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TrainingService } from 'src/app/services/training.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-employees',
  templateUrl: './admin-employees.component.html',
  styleUrls: ['./admin-employees.component.scss'],
  providers: [DecimalPipe],
})
export class AdminEmployeesComponent implements OnInit {
  employeeStatus = [];
  selectedEmployee = [];
  space = ' ';
  slash = ' / ';
  date: number;
  month: number;
  loading: boolean = false;
  isEditable = false;
  classList = ['toggler-wrapper', 'style-1'];
  loading2: boolean;
  isSaved = false;
  isEdited = false;
  isOpen = false;
  assign: boolean = false;
  months = ['None','January','February','March','April','May','June','July','August','September','October','November','December'];
  updatingEmployee: any;
  departments = [];
  isActiveOptions = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false }
  ];
  addEmployee: addEmployee = {
    fname: '',
    lname: '',
    empId: 0,
    department: '',
    role: '',
    isActive: true,
    orientationDate: new Date()
  };
  editEmployee: editEmployee = {
    strEmployeeFirstName: '',
    strEmployeeLastName: '',
    intEmployeeId: 0,
    intDepartmentId: 0,
    intClassificationId: 0,
    isActive: true,
    orientationDate: new Date()
  };
  classifications = [];

  // For searching employees
  filtered: Observable<any>;
  filter = new FormControl('', { nonNullable: true });

  // For searching trainings in the modal
  filteredTraining: Observable<any>;
  trainingFilter = new FormControl('', { nonNullable: true });

  // ===== Pagination fields =====
  currentPage: number = 1;   // start on page 1
  pageSize: number = 50;     // show 50 employees per page
  totalPages: number = 0;    // we will get this from the API
  totalCount: number = 0;    // total employees

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private pipe: DecimalPipe,
    private trainingService: TrainingService,
    public toastr: ToastrService,
    private employeeService: EmployeeService,
    private auth: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.date = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;

    this.getActiveDepartments();
    this.getClassifications();

    // Load the first page of employees
    this.getEmployees(1);

    // Setup search
    this.filtered = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.search(text, this.pipe))
    );
  }

  getActiveDepartments() {
    this.departmentService.getActiveDepartments().subscribe(
      (data) => {
        this.departments = [...this.departments, ...data];
      },
      (err) => {
        if (typeof err.error == 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error('Could not load the departments!');
        }
      }
    );
  }

  getClassifications() {
    this.employeeService.getClassifications().subscribe(
      (data) => {
        this.classifications = [...data];
      },
      (err) => {
        if (typeof err.error == 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error('Could not load the classifications!');
        }
      }
    );
  }

  // ======== MAIN PAGINATED EMPLOYEE FETCH =========
 // Example: employees.component.ts
getEmployees(page: number = 1, pageSize: number = 50) {
  this.loading = true;
  this.employeeService.getEmployees(page, pageSize).subscribe(
    (response) => {
      // 'response' is shaped like:
      // { currentPage, pageSize, totalPages, totalCount, data: [ ...employees... ] }

      // 1) The actual employees array is in response.data
      const employeesArray = response.data || [];  // fallback if null

      // 2) If you want to transform each employee, do so on employeesArray
      this.employeeStatus = employeesArray.map(emp => ({
        ...emp,
        intEmployeeId: emp.intEmployeeId ?? 0,
        completed: emp.completedTrainings ?? 0,
        totalTrainings: emp.totalTrainings ?? 0,
        status: emp.trainings ?? []
      }));

      // 3) Save pagination info if needed
      this.currentPage = response.currentPage;
      this.pageSize = response.pageSize;
      this.totalPages = response.totalPages;
      this.totalCount = response.totalCount;

      // 4) If you do searching/filtering, do it on this.employeeStatus
      this.filtered = this.filter.valueChanges.pipe(
        startWith(''),
        map(searchTerm => this.search(searchTerm, this.pipe)) 
      );

      this.loading = false;
    },
    (error) => {
      console.error('Error fetching employees:', error);
      this.loading = false;
    }
  );
}

  
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEmployees(this.currentPage, this.pageSize);
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEmployees(this.currentPage, this.pageSize);
    }
  }
    
  // ======== PAGINATION BUTTON HANDLERS ========
  goToPrevPage() {
    if (this.currentPage > 1) {
      this.getEmployees(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.getEmployees(this.currentPage + 1);
    }
  }

  // ========== Searching employees (front-end filter) ==========
  search(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return this.employeeStatus.filter((employee) => {
      return (
        employee.strEmployeeFirstName?.toLowerCase().includes(term) ||
        employee.strEmployeeLastName?.toLowerCase().includes(term) ||
        (employee.bitIsActive ? 'Active' : 'Inactive').toLowerCase().includes(term) ||
        employee.tblClassification?.strClassificationName?.toLowerCase().includes(term)
      );
    });
  }

  // ========== Searching trainings inside the modal ==========
  searchTraining(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return this.selectedEmployee.filter(({tblTraining, dtCompletionDate}) => {
      var date = new Date(dtCompletionDate);
      return (
        tblTraining?.strTrainingName?.toLowerCase().includes(term) ||
        new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric" })
          .format(date).toLowerCase().includes(term)
      );
    });
  }

  // ========== Modal openers etc. (unchanged) ==========
  open(content: any, employee: any) {
  
    if (!employee) {
      console.error("Error: Employee is undefined!");
      this.toastr.error("Employee data is missing.");
      return;
    }
  
    // 1) Figure out which array has the training items:
    const employeeTrainings = Array.isArray(employee)
      ? employee
      : (employee.trainings || employee.status || []);
  
    if (!Array.isArray(employeeTrainings) || employeeTrainings.length === 0) {
      console.error("No training data available:", employeeTrainings);
      this.toastr.error("No training data available for this employee.");
      return;
    }
  
   
    this.selectedEmployee = employeeTrainings.map(t => {
      let isoString = '';
      if (t.completionDate) {
        const parsedDate = new Date(t.completionDate);
        if (!isNaN(parsedDate.getTime())) {

          isoString = parsedDate.toISOString().split('T')[0]; 
        }
      }
  
      return {
        intTrainingId:   t.intTrainingId,
        intEmployeeId:   employee.intEmployeeId,   // keep the employee ID
        trainingName:    t.trainingName,
        // unify the isComplete field
        bitIsComplete:   t.isComplete ?? t.bitIsComplete ?? false,
        // store the raw date if you want, but the crucial part is dtCompletionDateString
        dtCompletionDate: t.completionDate || null,
        dtCompletionDateString: isoString,   // <-- new string property
        isEditing: false
      };
    });
  
  
    // 3) Open the modal
    this.modalService.open(content, { size: 'lg' });
  }
  

  openAdd(addEmployeeModal) {
    this.addEmployee = {
      fname: "",
      lname: "",
      empId: 0,
      department: '',
      role: '',
      isActive: true,
      orientationDate: new Date()
    };
    this.modalService.open(addEmployeeModal, { size: 'lg', centered: true });
  }

  openEditModal(editContent, employee) {
    if (!employee) {
      this.toastr.error("No employee data found!");
      console.error("Error: Employee object is undefined", employee);
      return;
    }
    if (!employee.strEmployeeFirstName) {
      this.toastr.error("Employee details are incomplete!");
      console.error("Error: Employee details missing", employee);
      return;
    }
    this.modalService.open(editContent, { size: 'lg', centered: true });
    this.updatingEmployee = employee;
    this.editEmployee = {
      strEmployeeFirstName: employee.strEmployeeFirstName || "",
      strEmployeeLastName: employee.strEmployeeLastName || "",
      intEmployeeId: employee.intEmployeeId || 0,
      intClassificationId: employee.intClassificationId || 0,
      intDepartmentId: employee.intDepartmentId || 0,
      isActive: employee.bitIsActive ?? true,
      orientationDate: employee.dtOrientationDate || new Date()
    };
  }

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

  saveTraining(training) {
    if (!training || !training.intTrainingId || !training.intEmployeeId || training.intEmployeeId === 0) {
      console.error("Training ID or Employee ID is undefined or invalid:", training);
      this.toastr.error("Training data is missing required fields.");
      return;
    }
    const updateData = {
      intTrainingId: training.intTrainingId,
      intEmployeeId: training.intEmployeeId,
      bitIsComplete: training.bitIsComplete === true,
      dtCompletionDate: training.dtCompletionDate ? new Date(training.dtCompletionDate) : null
    };
    this.http.put('https://localhost:7127/api/Training/update', [updateData])
      .subscribe(
        (response) => {
          this.toastr.success("Training updated successfully!");
          training.isEditing = false;
        },
        (error) => {
          console.error("Update Error:", error);
          this.toastr.error("Could not update the training!");
        }
      );
  }

  updateTraining(training) {
    const updateData = {
      intTrainingId: training.intTrainingId,
      intEmployeeId: training.intEmployeeId,
      bitIsComplete: training.bitIsComplete,
      completionDate: training.dtCompletionDate || null,
    };
    if (!updateData.intEmployeeId) {
      console.error("Error: Employee ID is missing!");
      alert("Employee ID is missing. Please check the data.");
      return;
    }
    this.http.put(`https://localhost:7127/api/Training/update`, [updateData])
      .subscribe(
        response => {
          alert("Training updated successfully!");
        },
        error => {
          console.error("Update Error:", error);
          alert("Error updating training!");
        }
      );
  }

  editable(employee) {
    this.isEditable = true;
    this.assign = false;
    this.addClass();
    this.toastr.success("The form is now editable");
    this.selectedEmployee = this.selectedEmployee.map(training => ({
      ...training,
      isEditing: true
    }));
    this.isEdited = true;
  }

  save(employee) {
    this.loading2 = true;
    this.isEditable = false;
    this.assign = false;
    this.removeClass();

    this.trainingService.updateStatus(employee.status).subscribe(
      (data) => {
        this.isSaved = true;
        this.toastr.success("Sucessfully updated the training status!");
        this.loading2 = false;
      },
      (err) => {
        if (typeof(err.error) == 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error("Sorry, the changes could not be saved!");
        }
        this.loading2 = false;
      }
    );
  }

  addNewEmployee(addForm: NgForm) {
    this.loading2 = true;
    if (!this.addEmployee.fname || !this.addEmployee.lname || this.addEmployee.empId === 0) {
      this.toastr.error("Please fill all required fields.");
      this.loading2 = false;
      return;
    }
    this.addEmployee.department = typeof addForm.value.department === 'object'
      ? addForm.value.department.strDepartmentName
      : addForm.value.department;
    this.addEmployee.role = typeof addForm.value.role === 'object'
      ? addForm.value.role.strClassificationName
      : addForm.value.role;

    this.employeeService.addNewEmployee(this.addEmployee).subscribe(
      (data) => {
        this.toastr.success("Successfully added the new employee!");
        this.modalService.dismissAll();
        // Reload page 1 or stay on current page (your call)
        this.getEmployees(this.currentPage);
        addForm.resetForm();
        this.loading2 = false;
      },
      (err) => {
        console.error("Error Adding Employee:", err);
        this.toastr.error("Error adding employee. Check logs for details.");
        this.loading2 = false;
      }
    );
  }

  updateEmployee(editForm: NgForm) {
    this.loading2 = true;
    if (editForm.valid) {
      this.editEmployee.intDepartmentId = typeof editForm.value.intDepartmentId === 'object'
        ? editForm.value.intDepartmentId.intDepartmentId
        : editForm.value.intDepartmentId;
      this.editEmployee.intClassificationId = typeof editForm.value.intClassificationId === 'object'
        ? editForm.value.intClassificationId.intClassificationId
        : editForm.value.intClassificationId;
      this.editEmployee.isActive = editForm.value.isActive ?? true;
      this.editEmployee.orientationDate = editForm.value.orientationDate || new Date();


      this.employeeService.editEmployee(this.editEmployee, this.editEmployee.intEmployeeId).subscribe(
        (updatedEmployee) => {
          this.isEdited = true;
          this.isSaved = true;
          this.loading2 = false;
          this.toastr.success("Successfully updated the employee!");

          // Replace in local array
          const index = this.employeeStatus.findIndex(emp => emp.intEmployeeId === updatedEmployee.intEmployeeId);
          if (index !== -1) {
            this.employeeStatus[index] = updatedEmployee;
          }
          editForm.resetForm();
        },
        (err) => {
          console.error("Update Error:", err);
          this.toastr.error("Could not update the employee!");
          this.loading2 = false;
        }
      );
    } else {
      this.toastr.error("Please fill out all required fields!");
      this.loading2 = false;
    }
  }

  addClass() {
    this.classList = [...this.classList, "enable"];
  }

  removeClass() {
    this.classList = ["toggler-wrapper", "style-1"];
  }
}
