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
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;
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
    // this.video = this.videoElement.nativeElement;
    // this.canvas = this.canvasElement.nativeElement;

    // Initialize webcam when the component loads
    this.initWebcam();
  }

  initWebcam(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
          // Silence the camera feed by setting the volume to 0
          this.video.volume = 0;
          // Wait a brief moment before capturing to ensure the camera has started
          setTimeout(() => {
            this.captureImage();
          }, 500);
        })
        .catch(error => {
          console.error('Error accessing the webcam:', error);
        });
    } else {
      console.log("ddd");

    }
  }

  captureImage(): void {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    const context: any = canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob: any) => {
      // Upload captured image immediately after capturing

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Now you have the base64 representation of the image
        console.log(base64data);
        // You can do whatever you want with the base64 data here
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
          console.log(result);
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
