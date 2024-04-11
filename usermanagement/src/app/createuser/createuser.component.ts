import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit {
  CreateUserForm!: FormGroup;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.CreateUserForm = this.formbuilder.group({
      FullName: [null, Validators.required],
      Email: [null, [Validators.required, Validators.email]],
      Role: [null, [Validators.required]],
      MobileNo: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    })
  }
}
