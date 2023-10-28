import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  RegisterSuccess:string=''//to hold success message
  
  RegisterError:string='';//to hold error message

  constructor(private fb:FormBuilder,private api:ApiService,private loginRouter:Router){}

  registerForm=this.fb.group({

    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  //form control passed to html form

  register(){
    if(this.registerForm.valid){
      // alert('Register clicked')
    console.log(this.registerForm.value);
    let username=this.registerForm.value.username
    let acno=this.registerForm.value.acno
    let password=this.registerForm.value.password
    console.log(username,acno,password);

    //Api call for register
    this.api.register(username,acno,password).subscribe((Response:any)=>{
      console.log(Response);
      alert(Response.message)//success
      this.RegisterSuccess=Response.message
      setTimeout(()=>{
      //redirect to loginpage
      this.loginRouter.navigateByUrl('')
      },3000)

    },
    (Response:any)=>{
      this.RegisterError=Response.error.message//error message
      setTimeout(()=>{
        this.registerForm.reset();
        this.RegisterError='';
      },2000)
    }
    
    )

    }else{
      alert('invalid Form')
    }
    
    
    
  }


}
