import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  aadharForm: FormGroup;
  showToast = false;
  toastConfig = {
    header:'Success!',
    class : 'bg-success text-light',
    message: 'Aadhar Created Sucessfully!'
  }
  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,private authService:AuthService
    ) { }

  ngOnInit(): void {
    this.aadharForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      fname:['',[Validators.required,Validators.minLength(3)]],
      lname:['',[Validators.required,Validators.minLength(3)]],
      mobno:['',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
      address:['',[Validators.required,Validators.minLength(10)]]
    });
  }
  submit(): void {
   if(this.aadharForm.valid){
    this.http.post<any>(environment.baseurl+'admin/add-user',this.aadharForm.value).subscribe
    ({
      next: (res) =>{
        this.aadharForm.reset();
        this.showToast = true;
        document.documentElement.scrollTop = 0;
      },
      error: (res) =>{
        if(res?.status === 401){
          this.authService.logout();
      }
       if(res?.status === 422){
         if(res.error.message === 'Mob Number already in use'){
          this.aadharForm.controls['mobno'].setErrors({duplicate:true});
         }
         if(res.error.message === 'E-Mail address already in use'){
          this.aadharForm.controls['email'].setErrors({duplicate:true});
         }
       }
      }
    });
   }
  }

}
