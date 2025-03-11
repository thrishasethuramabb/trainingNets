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
    this.getActiveEmployees();
    this.date = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;
    this.auth.getUser$().subscribe(u => {
      this.logedInUserRole = u?.role;
      console.log("Logged in user role:", this.logedInUserRole);
    });
  }

  // Search by first name, last name, or classification.
  search(text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    const results = this.employeeStatus.filter(employee => {
      const first = (employee.strEmployeeFirstName || "").toLowerCase();
      const last = (employee.strEmployeeLastName || "").toLowerCase();
      const classification = employee.tblClassification?.strClassificationName?.toLowerCase() || "";
      return first.includes(term) || last.includes(term) || classification.includes(term);
    });
    console.log("Search term:", term, "matches:", results.length);
    return results;
  }

  // When a row is clicked, set the selectedEmployee and open the modal.
  open(content: any, employee: any) {
    this.selectedEmployee = employee;
    // For each training in the selected employee, set CompletionDateString.
    if (this.selectedEmployee.trainings && Array.isArray(this.selectedEmployee.trainings)) {
      this.selectedEmployee.trainings.forEach((t: any) => {
        if (t.CompletionDate) {
          // Format as yyyy-MM-dd
          t.CompletionDateString = formatDate(new Date(t.CompletionDate), 'yyyy-MM-dd', 'en-US');
        } else {
          t.CompletionDateString = '';
        }
      });
    }
    console.log("Opening modal for employee:", this.selectedEmployee);
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  close() {
    this.isEditable = false;
    this.removeClass();
    this.assign = false;
    this.modalService.dismissAll();
    if (this.isEdited && this.isSaved) {
      console.log("Reloading after save...");
      location.reload();
      this.isSaved = false;
      this.isEditable = false;
    }
  }

  // Enable editing in the modal.
  editable(employee: any) {
    this.isEditable = true;
    this.assign = false;
    this.addClass();
    this.toastr.success("The form is now editable");
    this.isEdited = true;
    console.log("Editable toggled ON for employee:", employee);
  }

  // Save updated training statuses.
  // Convert the editable CompletionDateString back to a Date.
  save(employee: any) {
    console.log("Saving training status for employee:", employee);
    this.loading2 = true;
    this.isEditable = false;
    this.assign = false;
    this.removeClass();

    // Prepare payload by updating each training with a proper Date.
    const payload = employee.trainings.map((t: any) => {
      // If the string is not empty, convert to Date; otherwise, keep null.
      const newDate = t.CompletionDateString ? new Date(t.CompletionDateString) : null;
      // Update the training object before sending payload.
      t.CompletionDate = newDate;
      return {
        intEmployeeId: employee.intEmployeeId,
        intTrainingId: t.intTrainingId,
        bitIsComplete: t.IsComplete,
        dtCompletionDate: newDate
      };
    });
    console.log("Save payload:", payload);

    this.trainingService.updateStatus(payload).subscribe(
      (data) => {
        this.isSaved = true;
        this.toastr.success("Successfully updated the training status!");
        console.log("Update response:", data);
        this.loading2 = false;
      },
      (err) => {
        console.error("Save error:", err);
        this.toastr.error("Sorry, the changes could not be saved!");
        this.loading2 = false;
      }
    );
  }

  addClass() {
    this.classList = [...this.classList, "enable"];
  }

  removeClass() {
    this.classList = ["toggler-wrapper", "style-1"];
  }

  // Get active employees from backend.
  getActiveEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(
      (data) => {
        console.log("Received employee data:", data);
        this.employeeStatus = [...data];
        console.log("Employee count:", this.employeeStatus.length);
        this.filtered = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text, this.pipe))
        );
        this.loading = false;
      },
      (err) => {
        console.error("Error loading employees:", err);
        this.toastr.error("Could not load the employees!");
        this.loading = false;
      }
    );
  }

  assignLeader(form: NgForm, employee: any) {
    if (form.invalid && form.value.password.length < 6) {
      this.toastr.error("Password's length must be at least 6");
    } else if (form.invalid) {
      this.toastr.error("Please fill out all the required fields");
    } else {
      this.user.empId = employee.intEmployeeId;
      this.user.role = "leader";
      console.log("Assigning leader for employee:", employee);
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
    console.log("Deactivating leader for employee:", employee);
    this.auth.deactivateLeader(employee).subscribe(
      (data) => {
        console.log("Deactivation response:", data);
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
    console.log("Activating leader for employee:", employee);
    this.auth.activateLeader(employee).subscribe(
      (data) => {
        console.log("Activation response:", data);
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
