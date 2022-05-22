import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit,OnDestroy {
  isAuthenticated = false;
  notifier = new Subject();
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authService.user.pipe(takeUntil(this.notifier)).subscribe(user=>{
      this.isAuthenticated=!!user;
  });
  }
  logout():void{
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.notifier.next(null);
    this.notifier.complete();
  }
}
