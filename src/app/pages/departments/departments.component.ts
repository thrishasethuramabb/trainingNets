import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TrainingService } from 'src/app/services/training.service';
import { addDepartment, editDepartment } from 'src/app/models/addDepartment.model';
import { forkJoin } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
  providers: [DecimalPipe],


})
export class DepartmentsComponent implements OnInit {

  allDepartments=[]
  selectedDepartment=[]
  space=" ";
	date;
	month;
	loading:boolean = false;
	isEditable=false;
	classList=["toggler-wrapper", "style-1"]
	loading2:boolean;
	isSaved= false;
	isEdited=false;
  isOpen=false;
  months= ['None','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  updatingTraining;
  updatingDepartment;
  departments=[{
    intDepartmentId: 0,
    strDepartmentName: "All",
    bitIsActive:true,
  }];
  isActiveOptions=[
    {name: 'Active', value: true},
    {name: 'Inactive', value : false}]

  addDepartment:addDepartment={
    intDepartmentId: 0,
    strDepartmentName: "",
    bitIsActive: true
    }
  editDepartment:editDepartment={
      intDepartmentId: 0,
      strDepartmentName: "",
      bitIsActive: true
      }


  // To search the department
	search(text: string, pipe: PipeTransform) {
		return this.allDepartments.filter((department) => {
			const term = text.toLowerCase();
			// var date = new Date(training.tbltraining.dtTrainingDate);
      var isActive;
      if(department.bitIsActive){
        isActive="Active"
      }else{
        isActive="Inactive"
      }

			return (
				department.strDepartmentName?.toLowerCase().includes(term)||
         isActive.toLowerCase().includes(term)
			);
		});
	}

  //to search for employees inside the modal
 /* searchEmp(text: string, pipe: PipeTransform) {
    
		return this.selectedDepartment.filter((tblEmployee) => {
      const term = text.toLowerCase();
			
			return (
				tblEmployee?.strEmployeeFirstName?.toLowerCase().includes(term)||
        tblEmployee?.strEmployeeLastName?.toLowerCase().includes(term)||
        tblEmployee?.tblClassification?.strClassificationName.toLowerCase().includes(term)||
				
			);
		});
	}*/

  //to search for employees inside the modal
  searchEmp(text: string, pipe: PipeTransform) {
    return this.selectedDepartment.filter((employee) => {
      const term = text.toLowerCase();
      return (
        employee?.strEmployeeFirstName?.toLowerCase().includes(term) ||
        employee?.strEmployeeLastName?.toLowerCase().includes(term) ||
        employee?.tblClassification?.strClassificationName?.toLowerCase().includes(term)
      );
    });
   }

  filtered:Observable<any>
  //employee: Observable<any>
  filteredEmp:Observable<any>
	filter = new FormControl('', { nonNullable: true });
  empFilter = new FormControl('', { nonNullable: true });


  constructor(
    private modalService: NgbModal, 
    private pipe: DecimalPipe,
    public toastr: ToastrService, 
    public auth: AuthService, 
    public departmentService: DepartmentService,
    private employeeService: EmployeeService  
  ) { }
  
  ngOnInit(): void {
	 //this.date=new Date().getFullYear();
	 //this.month= new Date().getMonth()+1;
   this.getDepartments();
   /*this.filteredEmp = this.empFilter.valueChanges.pipe(
    startWith(''),
    map(text => this.searchEmp(text, this.pipe))
  );*/
  }


//opens add training modal
  openAdd(addTraining){
        this.modalService.open(addTraining, { size: 'lg', centered:true})
  }

//opens edit department modal
openEditModal(editContent, department){
  this.isSaved=true;
    this.loading2=true;
  this.modalService.open(editContent, { size: 'lg', centered:true})
  this.updatingDepartment=department;
  this.loading2=false;

   //this.editEmployee.isActive=employee.bitemployeeIsActive;
  this.editDepartment.strDepartmentName=department.strDepartmentName;
  this.editDepartment.intDepartmentId=department.intDepartmentId;
  this.editDepartment.bitIsActive=department.bitIsActive;
}
  //opens department details modal
  open(content) {
		this.modalService.open(content, { size: 'lg', centered:true})
    this.isOpen=true;
    
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

  //makes the modal checkboxes editable
	editable(department) {
    this.isEditable = true;
    this.toastr.success("Employee details are now editable");
  }
  
  saveEmployees(department) {
    this.loading2 = true;
    if (!department.employees || department.employees.length === 0) {
      this.toastr.info("No employees to update.");
      this.loading2 = false;
      return;
    }
    
    const updateCalls = [];
    
    for (const employee of department.employees) {
      // Create the update object.
      // Note: We use the existing classification id from employee.tblClassification.
      const updatedEmployee = {
        strEmployeeFirstName: employee.strEmployeeFirstName,
        strEmployeeLastName: employee.strEmployeeLastName,
        intEmployeeId: employee.intEmployeeId,
        intDepartmentId: employee.intDepartmentId || department.intDepartmentId,
        intClassificationId: employee.tblClassification ? employee.tblClassification.intClassificationId : null,
        isActive: employee.bitIsActive, // assuming bitIsActive is maintained
        orientationDate: employee.dtOrientationDate ? new Date(employee.dtOrientationDate) : null
      };
  
      updateCalls.push(this.employeeService.editEmployee(updatedEmployee, employee.intEmployeeId));
    }
  
    forkJoin(updateCalls).subscribe(
      (results) => {
        this.toastr.success("Employee details updated successfully!");
        this.isEditable = false;
        this.loading2 = false;
      },
      (error) => {
        console.error("Error updating employees", error);
        this.toastr.error("Error updating employee details!");
        this.loading2 = false;
      }
    );
  }
  

    //saves the updated data
  /*save(training){
	  this.isSaved=true;
    this.loading2=true;
    this.isEditable=false;
    this.removeClass();
    console.log(training);

    this.trainingService.updateStatus(training.status).subscribe(
      (data)=>{
            this.toastr.success("Sucessfully updated the training status!");
			this.loading2=false;


      }, (err)=>{
        console.log(err);
       if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Sorry, the changes could not be saved!")
        }
		this.loading2=false;

      })
  }*/


//adds css class to the checkboxes
  addClass(){
    this.classList=[...this.classList, "enable"]
  }

  //removes css class from the checkboxes
  removeClass(){
    this.classList=["toggler-wrapper", "style-1"]
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

  addNewDepartment(addForm: NgForm) {
    this.loading2 = true;
    // Since the department ID is auto-generated, force it to 0.
    this.addDepartment.intDepartmentId = 0;
    
    this.departmentService.addNewDepartment(this.addDepartment).subscribe(
      (data) => {
        this.isEdited = true;
        this.isSaved = true;
        this.loading2 = false;
        this.toastr.success("Successfully added the new department!");
        addForm.resetForm();
      },
      (err) => {
        if (typeof(err.error) === 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error("Could not add the department!");
        }
        this.loading2 = false;
      }
    );
  }

  
       updateDepartment(editForm:NgForm){

        this.loading2=true;
       // this.addDepartment.department = addForm.value.department.strDepartmentName;
    
         this.departmentService.editDepartment(this.editDepartment,this.editDepartment.intDepartmentId).subscribe(
             (data)=>{
              this.isEdited = true;
              this.isSaved= true;
              this.loading2=false;
              this.toastr.success("Successfully added the new department!")
              editForm.resetForm();
            }, (err)=>{
             if(typeof(err.error)=='string'){
              this.toastr.error(err.error)
            }else{
              this.toastr.error("Could not add the employee!")
             }
    
             this.loading2=false;

    
            }
          )
 
          }

        
  //gets all the trainings

  getDepartments(){
	this.loading=true;
	this.departmentService.getAllDepartments().subscribe(
		(data)=>{
		this.allDepartments=[...data ];

      // this.filteredEmp = this.empFilter.valueChanges.pipe(
			// 		startWith(''),
			// 		map((text) => this.searchEmp(text, this.pipe)),
			// 	);
    
      this.filtered = this.filter.valueChanges.pipe(
					startWith(''),
					map((text) => this.search(text, this.pipe)),
				);
		this.loading=false;
		},
		(err)=>{
			if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not load the trainings!")
        }
        this.loading=false;
		}
	)
   }

}

