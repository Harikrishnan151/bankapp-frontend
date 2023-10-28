import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  deleteSuccessMsg:string=''
  deleteConfirmStatus:boolean=false; //delete confirmation content 
  acno:any//for parent child data communication

 logoutSuccess:boolean=false
  transferSuccess:string=''
  transferError:string=''
  balance:string=''//to hold current balance
  user:string=''//to hold current username
  currentAcno:string=''//to hold current acno
  constructor(private fb:FormBuilder,private api:ApiService,private logoutRouter:Router){}
  ngOnInit(): void {

    if(!localStorage.getItem("token")){
      alert("Please login")
      this.logoutRouter.navigateByUrl('')
    }
    if(localStorage.getItem('currentUser')){
       this.user=localStorage.getItem('currentUser')||'';
      //  this.balance=localStorage.getItem('currentBalance')||'';
    }
  //   if(localStorage.getItem('currentBalance')){
  //     this.balance=localStorage.getItem('currentBalance')||'';
  //  }
   if(localStorage.getItem('currentAcno')){
    this.currentAcno=localStorage.getItem('currentAcno')||''
   }
  }
  iscollapse : boolean=false

  collapse(){
    
    this.iscollapse=!this.iscollapse
  }

  fundTransferForm=this.fb.group({
    CreditAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })

  dashboardForm(){
    if(this.fundTransferForm.valid){

     
      console.log(this.fundTransferForm.value);
      let CreditAcno=this.fundTransferForm.value.CreditAcno
      let amount=this.fundTransferForm.value.amount
      let  password=this.fundTransferForm.value.password
      this.api.fundTransfer(CreditAcno,password,amount).subscribe((result:any)=>{
        console.log(result);
        this.transferSuccess=result.message
        setTimeout(() => {
          this.transferSuccess=''
          this.fundTransferForm.reset()
        }, 3000);
        
      },
      (result:any)=>{
        console.log(result.error.message);
        this.transferError=result.error.message
        setTimeout(() => {
          this.fundTransferForm.reset()
          this.transferError=''
          
        }, 2000);
        
      })
      // alert('fund transfered')
      // console.log(CreditAcno,amount,password); 

    }else{
      alert('please enter valid parameters')
    }
   
    
  }reset(){
    this.fundTransferForm.reset()
  }


getBalance(){
  this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
    this.balance=result.balance
  },
  (result:any)=>{
    alert(result.error.message)
  })
}

logOut(){
 
  this.logoutSuccess=true
  
    
   
    setTimeout(() => {
      this.logoutRouter.navigateByUrl('')
      localStorage.clear()
    },3000);
  
  
}

deleteAccount(){
  this.acno=localStorage.getItem('currentAcno')
  this.deleteConfirmStatus=true
}

cancelDeleteConfirm(){
  this.acno=''
  this.deleteConfirmStatus=false
}

deleteFromParent(){
  this.api.deleteAccount().subscribe((result:any)=>{
    localStorage.clear()//to remove all the account details from localstorage
    this.deleteSuccessMsg=result.message//account deleted sucessfully message
    setTimeout(() => {
      this.logoutRouter.navigateByUrl('')//redirected to login page
    }, 3000);
   
  })
}

}
