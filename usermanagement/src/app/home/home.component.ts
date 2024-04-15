import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_service/api.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userForm!: FormGroup;
  UserList:any[]=[];

  constructor(private formbuilder: FormBuilder,
    private ApiService:ApiService
  )
   { }
  ngOnInit(): void {
    this.userForm = this.formbuilder.group({
      UserId:[''],
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Role: [null, [Validators.required]],
      Address: [null],
      Gender:[null,Validators.required],
      Mobile: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    })
    this.GetUserList();
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
    //this.userForm.reset()
    const modal = this.myModal.nativeElement;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
  }

  closeModal() {
    const modal = this.myModal.nativeElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
  }

  resetForm() {
    this.userForm.reset();
  }

  GetUserList(){
    this.ApiService.CallService('/UserList').pipe(first()).subscribe((result:any)=>{
      console.log(result)
      this.UserList = result.List;
    })
  }

 // Define a variable to store the UserId
userId: any;
selectedIndex:any

editUser(index: any) {
  // Retrieve the user data from the UserList array based on the index
  const userData = this.UserList[index];
  
  // Store the UserId in the userId variable
  this.userId = userData.UserId;

  // Patch the form with the user data
  this.userForm.patchValue({
    UserId: userData.UserId,
    FirstName: userData.FirstName,
    LastName: userData.LastName,
    Address: userData.Address,
    Role: userData.Role,
    Gender: userData.Gender,
    Email: userData.Email,
    Password: userData.Password,
    Mobile: userData.Mobile
  });

  // Optionally, you can also store the index for future reference if needed
 // this.selectedIndex = index;
  this.openModal();
}

submitForm() {
  let requestdata: any = {
    UserId: this.userId || null, // Include the stored UserId
    FirstName: this.userForm.get('FirstName')?.value,
    LastName: this.userForm.get('LastName')?.value,
    Address: this.userForm.get('Address')?.value,
    Role: this.userForm.get('Role')?.value,
    Gender: this.userForm.get('Gender')?.value,
    Email: this.userForm.get('Email')?.value,
    Password: this.userForm.get('Password')?.value,
    Mobile: this.userForm.get('Mobile')?.value,
  };
  this.ApiService.CallService('/AddUpdateUser', { Request: requestdata }).pipe(first()).subscribe((result: any) => {
    if (result && result.status === '1') {
      this.closeModal();
      alert(result.message);
      this.userForm.reset();
      this.GetUserList();
    }
  });
}
deleteUser(userId: any) {
  console.log(userId)
  let request = {
    'UserId':userId
  }
  console.log(request)
  this.ApiService.CallService('/DeleteUser', request ).pipe(first()).subscribe((result: any) => {
    if (result && result.status === '1') {
      alert(result.message); // Optionally, show an alert message
    } else {
      // If the deletion failed, show an error message
      alert(result.message || "Failed to delete user");
    }
  }, (error:any) => {
    // If an error occurred during the API call, handle it appropriately
    console.error("Error deleting user:", error);
    alert("An error occurred while deleting the user. Please try again later.");
  });
}


  
}
