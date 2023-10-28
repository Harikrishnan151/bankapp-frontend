import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  
  loginSuccuss:boolean=false
  loginError:string=''
  constructor(private lg:FormBuilder,private api:ApiService,private loginRouter:Router ){}
  



  loginForm=this.lg.group({
     
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]


  })

  login(){


    if(this.loginForm.valid){
      // alert('login successfull')
    let acno=this.loginForm.value.acno
    let password=this.loginForm.value.password
    console.log(acno,password);

    //api call for login
    this.api.login(acno,password).subscribe((response:any)=>{
        console.log(response);
        this.loginSuccuss=true;
        localStorage.setItem('currentUser',response.currentUser)//To set current username into the local storage
        localStorage.setItem('currentBalance',response.currentBalance)//to set current balance in to the local storage
        localStorage.setItem('currentAcno',response.currentAcno)//to det currentacno in to the local storage
        localStorage.setItem('token',response.token)
        // alert('login successfull')
        setTimeout(()=>{
          this.loginRouter.navigateByUrl('/dashboard')
        },2000)
        
        
    },
    (response)=>{
      //error message
      this.loginError=response.error.message
      setTimeout(()=>{
        this.loginForm.reset();
        this.loginError='';
      },2000)
    }
    )

    }else{
      alert('invalid account number or password')
    }
    
  }
}
