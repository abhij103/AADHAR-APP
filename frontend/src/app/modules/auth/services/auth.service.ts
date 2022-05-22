import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "./user.model";
import { tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  baseUrl = environment.baseurl;
  constructor(private http: HttpClient, private router: Router) { }
  loginToServer(e:string, p:string ,role:string) {
    const postUrl = role === 'admin' ? 'admin/login':'user/login';
    return this.http.post<any>(this.baseUrl + postUrl, {
      "email": e,
      "password": p
    }).pipe(tap(resData => {
      const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
      const user = new User(resData.userId, resData.token, expirationDate);
      this.user.next(user);
      this.autoLogout(60 * 60 * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
    }))
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {  // called on reload
    const userData: {
      _userId: string
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData._userId,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {// yet to expire
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    } else {//expired
      this.logout();
    }
  }
}