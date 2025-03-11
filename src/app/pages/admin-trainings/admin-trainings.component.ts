import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TrainingService } from 'src/app/services/training.service';
import { addTraining } from './../../models/addTraining.model';

@Component({
  selector: 'app-admin-trainings',
  templateUrl: './admin-trainings.component.html',
  styleUrls: ['./admin-trainings.component.scss'],
  providers: [DecimalPipe],
})
export class AdminTrainingsComponent implements OnInit {

  trainingStatus=[]
  selectedTraining=[]
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
  departments=[{
    intDepartmentId: 0,
    strDepartmentName: "All",
    bitIsActive:true,
  }];
  addTraining:addTraining={
    name:"",
    duration:0,
    frequency: 0,
    departments:[],
    departmentIds:[],
    isActive:true,
    isSpecial: false,
    date:new Date()
  }
  dueMonth:number;
  editTrainingModel:addTraining={
    name:"",
    duration:0,
    frequency: 0,
    departments:[],
    departmentIds:[],
    isActive: true,
    isSpecial: false,
    date:new Date()
  }

  DateSelected : any;

  isActiveOptions=[
    {name: 'Active', value: true},
    {name: 'Inactive', value : false}]

  // To search the trainings
// Search training data
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



// Search employee data inside modal
searchEmp(text: string, pipe: PipeTransform) {
  const term = text.toLowerCase();
  return this.selectedTraining.filter(emp => {
    const date = emp.completionDate ? new Date(emp.completionDate) : new Date();
    return (
      emp.employeeName?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term) ||
      (emp.isComplete ? 'complete' : 'incomplete').toLowerCase().includes(term) ||
      new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(date).toLowerCase().includes(term)
    );
  });
}




  filtered:Observable<any>
  filteredEmp:Observable<any>
	filter = new FormControl('', { nonNullable: true });
  empFilter = new FormControl('', { nonNullable: true });

	constructor(private modalService: NgbModal, private pipe: DecimalPipe, private trainingService: TrainingService,
    public toastr: ToastrService, public auth:AuthService, public departmentService: DepartmentService) {

	}
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
  
//opens add training modal
  openAdd(addTraining){
        this.modalService.open(addTraining, { size: 'lg', centered:true})
  }

//opens edit training modal
open(content, training) {
  if (!training || !training.trainingId) {
    console.error('No training data found for this record:', training);
    this.toastr.error('No training data found for this record');
    return;
  }
  console.log('Fetching training details for trainingId:', training.trainingId);
  this.trainingService.getTrainingById(training.trainingId).subscribe(
    (response) => {
      console.log('Response from getTrainingById:', response);
      const trainingData = Array.isArray(response) ? response[0] : response;
      if (trainingData && trainingData.employees && trainingData.employees.length > 0) {
        this.selectedTraining = trainingData.employees.map(emp => ({
          intEmployeeId: emp.employeeId,   // Use employeeId from the API response
          intTrainingId: trainingData.intTrainingId, // Use the training's ID from the API response
          isComplete: emp.isComplete,
          completionDate: emp.completionDate ? new Date(emp.completionDate) : null,
          employeeName: emp.employeeName,
          department: emp.department
        }));
        console.log('Mapped selectedTraining:', this.selectedTraining);
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




openEditModal(editContent, training) {
  console.log('Training ID passed to openEditModal():', training.trainingId);

  if (!training || !training.trainingId) {
    this.toastr.error('No training data found for this record');
    return;
  }

  this.trainingService.getTrainingById(training.trainingId).subscribe(
    (data) => {
      console.log('API response for openEditModal():', data);

      const trainingData = Array.isArray(data) ? data[0] : data;

      if (trainingData) {
        this.updatingTraining = trainingData;
        this.editTrainingModel.isActive = trainingData.bitTrainingIsActive;
        this.editTrainingModel.name = trainingData.strTrainingName;
        this.editTrainingModel.duration = trainingData.intTrainingDuration;
        this.editTrainingModel.frequency = trainingData.intTrainingFrequency;

        this.dueMonth = trainingData.dtTrainingDate
          ? new Date(trainingData.dtTrainingDate).getMonth() + 1
          : 0;

          this.editTrainingModel.departmentIds = trainingData.trainingDepartment
          ? trainingData.trainingDepartment.map((dept) => ({
              intDepartmentId: dept.tblDepartment?.intDepartmentId,
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
	editable(training) {
    // Try to get the training date from two possible properties.
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
  
  
  
  


    //saves the updated data
    save(training) {
  this.isSaved = true;
  this.loading2 = true;
  this.isEditable = false;
  this.removeClass();
  
  console.log('Saving updated training status. Payload:', this.selectedTraining);
  
  this.trainingService.updateStatus(this.selectedTraining).subscribe(
    (data) => {
      console.log('Response from updateStatus:', data);
      this.toastr.success("Successfully updated the training status!");
      this.loading2 = false;
    },
    (err) => {
      console.error('Error updating training status:', err);
      if (typeof(err.error) === 'string') {
        this.toastr.error(err.error);
      } else {
        this.toastr.error("Sorry, the changes could not be saved!");
      }
      this.loading2 = false;
    }
  );
}



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
      (data) => {
        this.departments = [...data];
        console.log('Departments loaded: ', this.departments);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
    
  }


  addNewTraining(addForm:NgForm){

    this.loading2=true;
    if(addForm.valid){
      if(this.dueMonth===0){
        //this training can be done through out the year
        this.addTraining.date=new Date('01/01/2000');
      }else{
        this.addTraining.date = new Date(`${this.dueMonth}/01/${new Date().getFullYear()}`)
      }

      this.addTraining.isSpecial=true;
      this.addTraining.departments.forEach(({strDepartmentName})=>{
        if(strDepartmentName==='All'){
          this.addTraining.isSpecial=false;
          this.addTraining.departments=[];
        }
      });

      console.log(this.addTraining.departments, this.addTraining.isSpecial);


      this.trainingService.addNewTraining(this.addTraining).subscribe(
        (data)=>{
          this.isEdited = true;
          this.isSaved= true;
          this.loading2=false;
          this.toastr.success("Successfully added the new training!")
          addForm.resetForm();
        }, (err)=>{
          console.log(err);
          if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not add the training!")
        }

        this.loading2=false;

        }
      )

    }else{
      this.toastr.error("Please fill out all the required fields!")
    }

  }

  updateTraining(editForm: NgForm) {
    this.loading2 = true;
    if (editForm.valid) {
      // Do not override the date. Assume the editTrainingModel.date is already set
      // from the data fetched in openEditModal(). If you need to update the date,
      // you should do it via a dedicated date input rather than using dueMonth alone.
  
      // Update the isSpecial flag based on departmentIds.
      // (If departmentIds is empty or includes 0, mark isSpecial as false.)
      this.editTrainingModel.isSpecial =
        this.editTrainingModel.departmentIds &&
        this.editTrainingModel.departmentIds.length > 0 &&
        !this.editTrainingModel.departmentIds.includes(0);
  
      // Call the service to update training.
      this.trainingService.editTraining(this.editTrainingModel, this.updatingTraining.intTrainingId)
        .subscribe(
          (data) => {
            this.isEdited = true;
            this.isSaved = true;
            this.toastr.success("Successfully updated the training!");
            this.loading2 = false;
          },
          (err) => {
            console.log(err);
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
  
  resetTraining(training){
    this.trainingService.resetTraining(training.intTrainingId).subscribe(
      (data)=>{
      this.toastr.success("Sucessfully reseted the training!");


      },
      (err)=>{
        console.log(err);
          if(typeof(err.error)=='string'){
          this.toastr.error(err.error)
        }else{
          this.toastr.error("Could not add the training!")
        }

      }
      )

  }
  //Date-picker
  fetchDateSelected(){
    console.log("date selected is ")
  }

  //gets all the trainings
getTrainings() {
  this.loading = true;
  this.trainingService.getActiveTrainings().subscribe(
    (data) => {
      console.log("API Response: ", data);

      if (data && Array.isArray(data)) {
        this.trainingStatus = data.map((training) => ({
          trainingId: training.trainingId,
          trainingName: training.trainingName,
          isActive: training.isActive ? 'Active' : 'Inactive',
          trainingDate: new Date(training.trainingDate),
          isSpecial: training.isSpecial,
          duration: training.intTrainingDuration ?? 0,  // Handle undefined
          frequency: training.frequency ?? 0,
          completed: [],  // Initialize as empty array
          status: [],     // Initialize as empty array
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

  
  
}