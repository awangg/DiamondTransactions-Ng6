import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: Http, private router: Router) { }

  ngOnInit() {
  }

  sendLoginRequest(form: any): void {
    var _this = this;
    this.http.post(
      '/api/login',
      {
        email: form.value.username,
        password: form.value.password
      }
    ).subscribe( (res: Response) => {
      sessionStorage.setItem('usrInfo', JSON.stringify(res.json()));
      _this.router.navigate(['/account']);
    })
  }

  sendCreationRequest(form: any): void {
    var _this = this;
    this.http.post(
      '/api/signup',
      {
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        email: form.value.email,
        password: form.value.password,
        address: form.value.address,
        city: form.value.city,
        state: form.value.state,
        country: form.value.country,
        zipcode: form.value.zipcode
      }
    ).subscribe( (res: Response) => {
      sessionStorage.setItem('usrInfo', JSON.stringify(res.json()));
      _this.router.navigate(['/account']);
    })
  }

}
