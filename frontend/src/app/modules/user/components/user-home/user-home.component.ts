import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  userDetails;
  spinner = true;
  constructor(private http:HttpClient,private authService:AuthService) { }

  ngOnInit(): void {
    this.http.get<any>(environment.baseurl + 'user/details').subscribe({
      next: (res) => {
         this.userDetails = res.user;
         this.spinner = false;
      },
      error: (res) =>{
        if(res?.status === 401){
            this.authService.logout();
        }
        this.spinner = false;
      }
    });
        
  }

}
