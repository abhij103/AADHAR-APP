import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  authForm: FormGroup;
  toastConfig = {
    header:'Error',
    class : 'bg-danger text-light',
    message: ''
  }
  showToast = false;
  constructor(private formBuilder: FormBuilder,private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role:['admin',Validators.required]
    });
  }
  submit(): void {
    if(this.authForm.valid){
      this.authService.loginToServer(this.authForm.value.email,
        this.authForm.value.password,this.authForm.value.role).subscribe({
          next: (res)=>{
            if(this.authForm.value.role === 'admin')
            this.router.navigate(['/admin/dashboard']);
            else
            this.router.navigate(['/user/home']);
          },
          error: (res) =>{
            console.log(res);
            if(res?.status === 401){
              console.log(1111);
              this.toastConfig.message = res.error.message;
              this.showToast = true;
            }
          }
        })
    }
  }
}
