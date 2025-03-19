import { DecimalPipe, formatDate } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TrainingService } from 'src/app/services/training.service';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [DecimalPipe],
})
export class EmployeesComponent implements OnInit {
  employeeStatus: any[] = [];
  selectedEmployee: any = null;
  slash: string = " / ";
  space: string = " ";
  date: number;
  month: number;
  loading: boolean = false;
  isEditable: boolean = false;
  classList: string[] = ["toggler-wrapper", "style-1"];
  loading2: boolean;
  isEdited: boolean = false;
  isSaved: boolean = false;
  assign: boolean = false;
  logedInUserRole: string;

  // Pagination fields
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  totalCount: number = 0;

  user: User = {
    username: "",
    empId: 0,
    password: "",
    role: ""
  };

  filtered: Observable<any>;
  filter = new FormControl('', { nonNullable: true });

  constructor(
    private modalService: NgbModal,
    private pipe: DecimalPipe,
    private trainingService: TrainingService,
    public toastr: ToastrService,
    private employeeService: EmployeeService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // 1) Optionally fetch the “active” employees if you want
    
    // 2) Also fetch the first page of employees (paginated)
    this.getEmployees(1, this.pageSize);

    this.date = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;

    // 3) Subscribe to user so we know if manager or not
    this.auth.getUser$().subscribe(u => {
      this.logedInUserRole = u?.role;
    });
  }

  // ================== Searching (front-end) =====================
  search(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return this.employeeStatus.filter(employee => {
      const first = (employee.strEmployeeFirstName || "").toLowerCase();
      const last  = (employee.strEmployeeLastName  || "").toLowerCase();
      const classification = employee.tblClassification?.strClassificationName?.toLowerCase() || "";
      return first.includes(term) || last.includes(term) || classification.includes(term);
    });
  }

  // ================== PAGINATED GET =====================
  getEmployees(page: number = 1, pageSize: number = 50) {
    this.loading = true;
    this.employeeService.getEmployees(page, pageSize).subscribe(
      (response) => {
        // 1) The array is in response.data
        const employeesArray = response.data || [];
  
        // 2) Put them into employeeStatus
        this.employeeStatus = [...employeesArray];
  
        // 3) Save pagination fields if you want
        this.currentPage = response.currentPage;
        this.pageSize    = response.pageSize;
        this.totalPages  = response.totalPages;
        this.totalCount  = response.totalCount;
  
        // 4) Front-end search on employeeStatus
        this.filtered = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text, this.pipe))
        );
  
        this.loading = false;
      },
      (error) => {
        console.error("Error loading employees:", error);
        this.toastr.error("Could not load employees!");
        this.loading = false;
      }
    );
  }
  
  // Simple pagination controls
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEmployees(this.currentPage, this.pageSize);
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEmployees(this.currentPage, this.pageSize);
    }
  }

  // ================== “Active” employees (optional) =====================
  getActiveEmployees() {
    // If you only want to call this for managers or something, you can do so.
    // Or remove it if you only do pagination.
    this.loading = true;
    this.employeeService.getEmployees().subscribe(
      (data) => {
        // If the “active” route also returns {data: [...]} shape, adjust accordingly
        if (Array.isArray(data)) {
          this.employeeStatus = [...data];
        } else {
          // Possibly data is in data.data or similar
          // this.employeeStatus = data.data || [];
        }
        this.filtered = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text, this.pipe))
        );
        this.loading = false;
      },
      (err) => {
        console.error("Error loading employees (active):", err);
        this.toastr.error("Could not load the employees!");
        this.loading = false;
      }
    );
  }

  // ================== OPEN MODAL FOR TRAININGS =====================
  open(content: any, employee: any) {
    this.selectedEmployee = employee;
  
    // If this employee has a trainings array, unify the property names:
    if (this.selectedEmployee.trainings && Array.isArray(this.selectedEmployee.trainings)) {
      this.selectedEmployee.trainings.forEach((t: any) => {
        // If the server returned t.IsComplete or t.bitIsComplete, unify it to t.isComplete:
        t.bitIsComplete = t.IsComplete ?? t.bitIsComplete ?? false;
  
        // Convert the server date (maybe t.completionDate) into a string for <input type="date">
        if (t.completionDate) {
          // e.g. use Angular’s formatDate if needed
          t.CompletionDateString = formatDate(t.completionDate, 'yyyy-MM-dd', 'en-US');
        } else {
          t.CompletionDateString = '';
        }
      });
    }
  
    this.modalService.open(content, { size: 'lg', centered: true });
  }
  

  // ================== EDIT / SAVE TRAININGS =====================
  editable(employee: any) {
    this.isEditable = true;
    this.assign = false;
    this.addClass();
    this.toastr.success("The form is now editable");
    this.isEdited = true;
  }

  save(employee: any) {
    this.loading2 = true;
    this.isEditable = false;
    this.assign = false;
    this.removeClass();

    // Build the payload for update
    const payload = employee.trainings.map((t: any) => {
      return {
        intEmployeeId: employee.intEmployeeId,
        intTrainingId: t.intTrainingId,
        bitIsComplete: t.isComplete, // we mapped it to isComplete
        dtCompletionDate: t.CompletionDateString
          ? new Date(t.CompletionDateString)
          : null
      };
    });

    this.trainingService.updateStatus(payload).subscribe(
      (data) => {
        this.isSaved = true;
        this.toastr.success("Successfully updated the training status!");
        this.loading2 = false;
      },
      (err) => {
        console.error("Save error:", err);
        this.toastr.error("Sorry, the changes could not be saved!");
        this.loading2 = false;
      }
    );
  }

  // ================== MISC =====================
  close() {
    this.isEditable = false;
    this.removeClass();
    this.assign = false;
    this.modalService.dismissAll();
    if (this.isEdited && this.isSaved) {
      location.reload();
      this.isSaved = false;
      this.isEditable = false;
    }
  }

  addClass() {
    this.classList = [...this.classList, "enable"];
  }
  removeClass() {
    this.classList = ["toggler-wrapper", "style-1"];
  }

  // ================== MANAGER’S LEADER ASSIGNMENT =====================
  assignLeader(form: NgForm, employee: any) {
    if (form.invalid && form.value.password.length < 6) {
      this.toastr.error("Password's length must be at least 6");
    } else if (form.invalid) {
      this.toastr.error("Please fill out all the required fields");
    } else {
      this.user.empId = employee.intEmployeeId;
      this.user.role = "leader";
      this.auth.signup(this.user).subscribe(
        (data) => {
          this.toastr.success("Successfully updated the role!");
          this.assign = false;
        },
        (err) => {
          console.error("Assign leader error:", err);
          this.toastr.error("Could not update the role!");
        }
      );
    }
  }

  deactivate(employee: any) {
    this.auth.deactivateLeader(employee).subscribe(
      (data) => {
        location.reload();
        this.toastr.success("Successfully updated the role!");
      },
      (err) => {
        console.error("Deactivation error:", err);
        this.toastr.error("Could not update the role!");
      }
    );
  }

  activate(employee: any) {
    this.auth.activateLeader(employee).subscribe(
      (data) => {
        location.reload();
        this.toastr.success("Successfully activated the existing account!");
      },
      (err) => {
        console.error("Activation error:", err);
        this.toastr.error("Could not activate the account!");
      }
    );
  }

  showForm(employee: any) {
    if (!employee.tblUserAccount) {
      this.assign = true;
    } else {
      this.activate(employee);
    }
  }
}