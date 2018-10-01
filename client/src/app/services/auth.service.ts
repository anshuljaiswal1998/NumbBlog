import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
// import { tokenNotExpired } from 'angular2-jwt'; //DEPRECIATED
import { JwtHelperService } from '@auth0/angular-jwt';

import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  domain = "http://localhost:8000";
  user;
  authToken;
  options;
  constructor(
    private http : Http,
    private jwtHelper: JwtHelperService
  ) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-Type': 'application/json',
        'authorization' : this.authToken
      })
    });
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    console.log(user);
    return this.http.post('http://localhost:8000/auth/register',user).pipe(map(res => res.json()));
  }

  checkUsername(username){
    // console.log(user);
    return this.http.get('http://localhost:8000/auth/checkUsername/'+username).pipe(map(res => res.json()));
  }

  checkEmail(email){
    // console.log(email);
    return this.http.get('http://localhost:8000/auth/checkEmail/'+email).pipe(map(res => res.json()));
  }

  login(user){
    return this.http.post('http://localhost:8000/auth/login/',user).pipe(map(res => res.json()));
  }

  logout(){
    this.user = null;
    this.authToken = null;
    localStorage.clear();
  }

  storeDataUser(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.user = user;
    this.authToken = token;
  }

  getProfile(){
    this.createAuthenticationHeaders();
    // console.log(this.jwtHelper.isTokenExpired());
    return this.http.get('http://localhost:8000/auth/profile',this.options).pipe(map(res => res.json()));
  }

  loggedIn() {
    // console.log(this.jwtHelper.isTokenExpired());
    return this.jwtHelper.isTokenExpired();
    // return false;
    // return tokenNotExpired('authToken');
  }

}
