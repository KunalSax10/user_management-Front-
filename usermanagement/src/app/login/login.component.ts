import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup
  constructor(private formbuilder: FormBuilder

  ) { }

  ngOnInit(): void {
    this.LoginForm = this.formbuilder.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [null, [Validators.required]]
    })
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
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

  SubmitLoginForm(){
    if(this.LoginForm.valid){

    }else{
      this.LoginForm.markAllAsTouched
    }
  }
}
