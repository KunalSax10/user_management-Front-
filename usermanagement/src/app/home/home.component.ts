import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_service/api.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userForm!: FormGroup;
  UserList: any[] = [];
  Role: any;
  UserUpdate: any;
  UserName: any;
  FormHeading = 'Add User';
  FormButton = 'Save';
  constructor(private formbuilder: FormBuilder,
    private ApiService: ApiService, private router: Router
  ) { }


  ngOnInit(): void {
    console.log(this.ApiService.UserSession.Role);
    this.ApiService.UserSession
    this.Role = this.ApiService.UserSession.Role;
    this.UserName = this.ApiService.UserSession.FullName;

    this.userForm = this.formbuilder.group({
      UserId: [''],
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Role: [null, [Validators.required]],
      Address: [null],
      Gender: [null, Validators.required],
      Mobile: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    })
    this.GetUserList();
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
    const modal = this.myModal.nativeElement;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
  }

  closeModal() {
    this.resetForm();
    const modal = this.myModal.nativeElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.removeAttribute('aria-modal');
  }

  resetForm() {
    this.userForm.reset();
    this.FormHeading = 'Add User';
    this.FormButton = 'Save';
    this.UserUpdate = null;
  }

  GetUserList() {
    this.ApiService.CallService('/UserList').pipe(first()).subscribe((result: any) => {
      console.log(result)
      this.UserList = result.List;
    })
  }

  userId: any;
  editUser(index: any) {
    this.FormHeading = 'Update User';
    this.FormButton = 'Update';
    let userData = this.UserList[index];
    this.UserUpdate = userData.UserId;
    this.userForm.patchValue({
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      Address: userData.Address,
      Role: userData.Role,
      Gender: userData.Gender,
      Email: userData.Email,
      Password: userData.Password,
      Mobile: userData.Mobile
    });
    this.openModal();
  }

  submitForm() {
    this.userForm.value.UpdateUserId = (this.userForm.value.UpdateUserId == undefined || this.userForm.value.UpdateUserId == '') ? '0' : this.userForm.value.UpdateUserId;
    let requestdata: any = {
      UpdateUserId: this.UserUpdate,
      FirstName: this.userForm.get('FirstName')?.value,
      LastName: this.userForm.get('LastName')?.value,
      Address: this.userForm.get('Address')?.value,
      Role: this.userForm.get('Role')?.value,
      Gender: this.userForm.get('Gender')?.value,
      Email: this.userForm.get('Email')?.value,
      Password: this.userForm.get('Password')?.value,
      Mobile: this.userForm.get('Mobile')?.value,
    };
    this.ApiService.CallService('/AddUpdateUser', requestdata).pipe(first()).subscribe((result: any) => {
      if (result && result.status === '1') {
        this.closeModal();
        alert(result.message);
        this.resetForm()
        this.GetUserList();
      } else {
        alert(result.message);
      }
    });
  }

  deleteUser(id: any) {
    let req = { 'UserId': id };
    this.ApiService.CallService('/DeleteUser', req).pipe(first()).subscribe(
      (result: any) => {
        if (result.status == '1') {
          this.GetUserList();
          alert(result.message);
        } else {
          alert(result.message);
        }
      },
      (error: any) => {
        alert('Something went wrong');
      }
    );
  }


  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

}
