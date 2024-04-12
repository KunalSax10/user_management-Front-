import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userForm!: FormGroup;
  constructor(private formbuilder: FormBuilder) { }
  ngOnInit(): void {
    this.userForm = this.formbuilder.group({
      fullName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
      address: [null],
      mobileNo: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
    this.userForm.reset()
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

  submitForm() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
