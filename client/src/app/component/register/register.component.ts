import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  form : FormGroup;
  message;
  messageClass;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  
  processing = false;

  constructor(
    private formBuilder : FormBuilder,
    private authservice : AuthService,
    private router : Router
  ) { 
    this.createForm();
  }


  createForm(){
    this.form = this.formBuilder.group({
      email:['',Validators.compose([
        Validators.email,
        Validators.required
      ])],
      username:['',Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])],
      password:['',Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(25)
      ])],
      confirm:['',Validators.required]
    }, {validator: this.matchingPassword('password','confirm')});
  }

  matchingPassword(password,confirm){
    return (group : FormGroup) =>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return {'matchingPassword': true} ;
      }
    }
  }

  disableForm(){
    this.form.get('email').disable();
    this.form.get('password').disable();
    this.form.get('username').disable();
    this.form.get('confirm').disable();
  }

  enableForm(){
    this.form.get('email').enable();
    this.form.get('password').enable();
    this.form.get('username').enable();
    this.form.get('confirm').enable();
  }

  onRegisterSubmit(){
    // console.log(this.form);      
    this.processing = true;
    this.disableForm();

    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authservice.registerUser(user).subscribe(data => {
      console.log("Inside the Function Register User");
      if(!data.success){
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.enableForm();
        this.processing = false;
      }else{
        console.log(data);
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout(()=>{
          this.router.navigate(['/login']);
        },2000);
      }
    });

  }

  checkEmail(){
    this.authservice.checkEmail(this.form.get('email').value).subscribe(data =>{
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      }else{
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    });
  }

  checkUsername(){
    this.authservice.checkUsername(this.form.get('username').value).subscribe(data =>{
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      }else{
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  }


  ngOnInit() {
  }

}
