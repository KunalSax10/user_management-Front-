import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ApiService } from '../_service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup
  constructor(private formbuilder: FormBuilder,
private ApiService : ApiService,
private router:Router
  ) { }

  ngOnInit(): void {
    this.LoginForm = this.formbuilder.group({
      Email: [null, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      Password: [null, [Validators.required]]
    })
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
    this.LoginForm.reset()
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

  SubmitLoginForm() {
    if (this.LoginForm.valid) {
      let request = {
        Email: this.LoginForm.get('Email')?.value,
        Password: this.LoginForm.get('Password')?.value,
      };    
      this.ApiService.Login(request)
        .pipe(first())
        .subscribe((result:any) => { // Adjust to the correct response type
          console.log(result);
          if (result && result.status === '1'){
            alert(result.message);
            this.router.navigate(['/home'])
          }
        });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }
  
  
}
