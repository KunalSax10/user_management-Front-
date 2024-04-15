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
  LoginForm!: FormGroup;
  video: any;
  canvas: any;
  capturedImage: any = null;

  constructor(private formbuilder: FormBuilder,
    private ApiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.LoginForm = this.formbuilder.group({
      Email: [null, [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      Password: [null, [Validators.required]]
    })
    this.initWebcam();
  }

  initWebcam(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
          this.video.volume = 0;
          setTimeout(() => {
            this.captureImage();
          }, 500);
        })
        .catch(error => {
          console.error('Error accessing the webcam:', error);
        });
    } else {
      // console.log("ddd");

    }
  }

  captureImage(): void {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const context: any = canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
      };
    }, 'image/jpeg');
  }

  @ViewChild('myModal') myModal!: ElementRef;
  openModal() {
    this.LoginForm.reset();
    const modal = this.myModal.nativeElement;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', 'true');
  }

  closeModal() {
    this.LoginForm.reset();
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
        .subscribe((result: any) => {
          if (result && result.status === '1') {
            alert(result.message);
            this.router.navigate(['/home'])
          } else {
            alert(result.message);
          }
        });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }


}
