import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { addEmployee } from 'src/app/models/addEmployee.model';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TrainingService } from 'src/app/services/training.service';
import { editEmployee } from 'src/app/models/addEmployee.model';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin-employees',
  templateUrl: './admin-employees.component.html',
  styleUrls: ['./admin-employees.component.scss'],
  providers: [DecimalPipe],

})
export class AdminEmployeesComponent implements OnInit {

  employeeStatus=[]
  selectedEmployee=[]
  space=" ";
  slash=" / "
	date;
	month;
	loading:boolean = false;
	isEditable=false;
	classList=["toggler-wrapper", "style-1"]
	loading2:boolean;
	isSaved= false;
	isEdited=false;
  isOpen=false;
  assign:boolean = false;
  months= ['None','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  updatingEmployee;
  departments=[]
  isActiveOptions=[
    {name: 'Active', value: true},
    {name: 'Inactive', value : false}]
  addEmployee:addEmployee={
    fname: "",
    lname: "",
    empId: 0,
    department:'',
    role: '',
    isActive: true,
    orientationDate: new Date()
  }
  editEmployee:editEmployee={
    strEmployeeFirstName: "",
    strEmployeeLastName: "",
    intEmployeeId: 0,
    intDepartmentId: 0,
    intClassificationId: 0,
    isActive: true,
    orientationDate: new Date()
  }
  classifications=[];


  // To search the employees
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
  

  //to search for trainings inside the modal
  searchTraining(text: string, pipe: PipeTransform) {
		return this.selectedEmployee.filter(({tblTraining, dtCompletionDate})=>{
      const term = text.toLowerCase();
			var date = new Date(dtCompletionDate);
			return (
			  tblTraining.strTrainingName?.toLowerCase().includes(term)||
				new Intl.DateTimeFormat("en-US", { month: "long",day :"2-digit", year:"numeric"  }).format(date).toLowerCase().includes(term)
			);
		});
	}
  	filtered:Observable<any>
    filteredTraining:Observable<any>
	  filter = new FormControl('', { nonNullable: true });
  	trainingFilter = new FormControl('', { nonNullable: true });


  constructor(private http: HttpClient, private modalService: NgbModal, private pipe: DecimalPipe, private trainingService: TrainingService,
    public toastr: ToastrService, private employeeService:EmployeeService, private auth: AuthService, private departmentService: DepartmentService) { }

    ngOnInit(): void {
      this.getEmployees();
      this.date = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
      this.getActiveDepartments();
      this.getClassifications();
    
      // Create filtered observable similar to trainings tab
      this.filtered = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text, this.pipe))
      );
    }
    
  getActiveDepartments(){
    this.departmentService.getActiveDepartments().subscribe(
      (data)=>{
        this.departments=[...this.departments,...data];
      },
      (err)=>{
        if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not load the departments!")
        }
      }
    )
  }

  getClassifications(){
    this.employeeService.getClassifications().subscribe(
      (data)=>{
        this.classifications=[...data]
      }
      ,(err)=>{
        if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not load the departments!")
        }
      }
    )
  }
 
  getEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(
        (data) => {
            console.log("API Employee Response:", data);

            this.employeeStatus = data.map(emp => ({
                ...emp,
                intEmployeeId: emp.intEmployeeId ?? 0,
                completed: emp.completedTrainings ?? 0,
                totalTrainings: emp.totalTrainings ?? 0,
                status: emp.trainings ?? []
            }));

            this.loading = false;
        },
        (err) => {
            console.error("Error Fetching Employees:", err);
            this.loading = false;
        }
    );
}









    //opens training details modal
    open(content, employee) {
      console.log("Opening Training Details for Employee:", employee); // Debugging Employee Object
      if (!employee) {
        console.error("Error: Employee is undefined!");
        this.toastr.error("Employee data is missing.");
        return;
      }  
      // FIX: Ensure `trainings` is correctly accessed
      let employeeTrainings = Array.isArray(employee) ? employee : employee.trainings || employee.status || [];  
      if (!Array.isArray(employeeTrainings) || employeeTrainings.length === 0) {
        console.error("Error: Employee trainings is not an array or is empty!", employeeTrainings);
        this.toastr.error("No training data available for this employee.");
        return;
      } 
      // Ensure training list is properly mapped with employee ID
      this.selectedEmployee = employeeTrainings.map(t => ({
        intTrainingId: t.intTrainingId,
        intEmployeeId: employee.intEmployeeId || 0, // Ensure employee ID is correctly assigned
        trainingName: t.trainingName || "Unknown",
        bitIsComplete: t.bitIsComplete || false,
        dtCompletionDate: t.dtCompletionDate || null,
        isEditing: false
      }));
      console.log("Mapped Trainings for Employee:", this.selectedEmployee); // Debugging
      this.modalService.open(content, { size: 'lg' });
    }
    
    
    
  


  //opens add training modal
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

  
//opens edit employee modal
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
  //closes the modals
	close(){
		this.isEditable=false;
    this.isOpen=false;
		this.removeClass();
		this.modalService.dismissAll();
		if(this.isEdited && this.isSaved){
			location.reload();
			this.isSaved=false;
			this.isEditable=false;
		}
	}
 



  saveTraining(training) {
    if (!training || !training.intTrainingId || !training.intEmployeeId || training.intEmployeeId === 0) {
      console.error("Training ID or Employee ID is undefined or invalid:", training);
      this.toastr.error("Training data is missing required fields.");
      return;
    }
  
    // Build payload using the correct property names
    const updateData = {
      intTrainingId: training.intTrainingId,
      intEmployeeId: training.intEmployeeId,
      bitIsComplete: training.isComplete === "true" || training.isComplete === true || training.bitIsComplete === true,
      dtCompletionDate: training.completionDate ? new Date(training.completionDate) : (training.dtCompletionDate ? new Date(training.dtCompletionDate) : null)
    };
  

  
    this.http.put(`http://localhost:8083/api/Training/update`, [updateData])
      .subscribe(
        (response) => {
          console.log("Update Success:", response);
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
  // Ensure employee ID is assigned correctly
  const updateData = {
    intTrainingId: training.intTrainingId,
    intEmployeeId: training.intEmployeeId || this.selectedEmployee.find(t => t.intTrainingId === training.intTrainingId)?.intEmployeeId,
    bitIsComplete: training.bitIsComplete,
    completionDate: training.dtCompletionDate || null,
  };

  // Debugging - Check the final data before sending
  console.log("Final Data Before API Call:", updateData);

  if (!updateData.intEmployeeId) {
    console.error("Error: Employee ID is missing!");
    alert("Employee ID is missing. Please check the data.");
    return;
  }

  this.http.put(`http://localhost:8083/api/Training/update`, [updateData])
    .subscribe(
      response => {
        console.log("Update Success:", response);
        alert("Training updated successfully!");
      },
      error => {
        console.error("Update Error:", error);
        alert("Error updating training!");
      }
    );
}



  editable(employee){
    this.isEditable = true;
    this.assign = false;
    this.addClass();
    this.toastr.success("The form is now editable");


    this.selectedEmployee = this.selectedEmployee.map(training => ({
        ...training,
        isEditing: true // Add `isEditing` flag to training objects
    }));

    this.isEdited = true;
}


  save(employee){
    this.loading2=true;
    this.isEditable=false;
    this.assign=false;
    this.removeClass();

    this.trainingService.updateStatus(employee.status).subscribe(
      (data)=>{
        this.isSaved=true;
        this.toastr.success("Sucessfully updated the training status!");
        this.loading2=false;

      }, (err)=>{
        if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Sorry, the changes could not be saved!")
        }
        this.loading2=false;

      })
  }

  addNewEmployee(addForm: NgForm) {
    this.loading2 = true;

    if (!this.addEmployee.fname || !this.addEmployee.lname || this.addEmployee.empId === 0) {
        this.toastr.error("Please fill all required fields.");
        this.loading2 = false;
        return;
    }

    // Ensure department and classification are properly assigned
    this.addEmployee.department = typeof addForm.value.department === 'object'
        ? addForm.value.department.strDepartmentName
        : addForm.value.department;

    this.addEmployee.role = typeof addForm.value.role === 'object'
        ? addForm.value.role.strClassificationName
        : addForm.value.role;

    console.log("Sending Employee Data:", this.addEmployee); // Debugging

    this.employeeService.addNewEmployee(this.addEmployee).subscribe(
        (data) => {
            console.log("Employee Created Successfully:", data);
            this.toastr.success("Successfully added the new employee!");
            this.modalService.dismissAll();  // Close modal
            this.getEmployees();  // Refresh list
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
        this.editEmployee.intDepartmentId = typeof editForm.value.intDepartmentId === 'object' ? editForm.value.intDepartmentId.intDepartmentId : editForm.value.intDepartmentId;
        this.editEmployee.intClassificationId = typeof editForm.value.intClassificationId === 'object' ? editForm.value.intClassificationId.intClassificationId : editForm.value.intClassificationId;
        this.editEmployee.isActive = editForm.value.isActive ?? true;
        this.editEmployee.orientationDate = editForm.value.orientationDate || new Date();

        console.log("Sending update request:", this.editEmployee);

        this.employeeService.editEmployee(this.editEmployee, this.editEmployee.intEmployeeId).subscribe(
            (updatedEmployee) => {
                this.isEdited = true;
                this.isSaved = true;
                this.loading2 = false;
                this.toastr.success("Successfully updated the employee!");

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


    
//adds css class to the checkboxes
  addClass(){
    this.classList=[...this.classList, "enable"]
  }

  //removes css class from the checkboxes
  removeClass(){
    this.classList=["toggler-wrapper", "style-1"]
  }


}
