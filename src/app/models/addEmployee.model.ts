export interface addEmployee{
    fname:string;
    lname:string;
    empId: number;
    department: any;
    role:any;
    isActive: boolean;
    orientationDate: Date;
    


}

export interface editEmployee{
   
    intEmployeeId: number;
    intDepartmentId: any;
    intClassificationId:any;
    isActive: boolean;
    orientationDate: Date;
    strEmployeeFirstName:string;
    strEmployeeLastName:string;



}
