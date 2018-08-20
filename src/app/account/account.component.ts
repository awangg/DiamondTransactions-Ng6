import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  usrData: any;
  panels: any;

  constructor(private http: Http, private router: Router) {
    this.usrData = JSON.parse(sessionStorage.getItem('usrInfo'));
    this.panels = [
      { title: "Visit the Store", link: "/home", description: "Browse our selection of products"},
      { title: "Return Home", link: "https://www.diamonddiagnostics.com/en/default.asp", description: "Return to the main site"}
    ];
  }

  capitalize(phrase: string): string {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1).toLowerCase();
  }

  logout(): void {
    sessionStorage.removeItem('usrInfo');
    this.router.navigate(['/home']);
  }

  sendUpdateRequest(form: any): void {
    var _this = this;
    this.http.post(
      '/api/updateinfo',
      {
        firstname: form.value.firstname,
        lastname: form.value.lastname,
        email: form.value.email,
        _id: _this.usrData._id,
        address: form.value.address,
        city: form.value.city,
        state: form.value.state,
        country: form.value.country,
        zipcode: form.value.zipcode
      }
    ).subscribe( (res: Response) => {
      sessionStorage.setItem('usrInfo', JSON.stringify(res.json()));
      location.reload();
    })
  }

}
