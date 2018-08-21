import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  usrData: any;
  panels: any;
  cart: any;
  orders: any;

  constructor(private http: Http, private router: Router) {
    this.usrData = JSON.parse(sessionStorage.getItem('usrInfo'));
    this.panels = [
      { title: "Visit the Store", link: "/home", description: "Browse our selection of products"},
      { title: "Return Home", link: "https://www.diamonddiagnostics.com/en/default.asp", description: "Return to the main site"}
    ];
    this.getCartRequest();
    this.getOrdersRequest();
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

  getCartRequest(): void {
    var _this = this;
    this.http.post(
      '/api/getcart',
      {
        user_id: this.usrData._id
      }
    ).subscribe( (res: Response) => {
      _this.cart = res.json();
    })
  }

  sendCartRemoveRequest(product: any): void {
    var _this = this;
    this.http.post(
      '/api/removecart',
      {
        user_id: this.usrData._id,
        product: product
      }
    ).subscribe( (res: Response) => {
      var index = _this.cart.indexOf(product);
      _this.cart.splice(index, 1);
    })
  }

  calculateSubtotal(): number {
    var sum = 0;
    this.cart.forEach( function(item) {
      sum += item.quantity * item.price;
    })
    return sum;
  }

  sendCheckoutRequest(): void {
    var _this = this;
    this.http.post(
      '/api/addorder',
      {
        user_id: this.usrData._id,
        cart: this.cart,
        price: this.calculateSubtotal() * 1.0625 * 1.00575
      }
    ).subscribe( (res: Response) => {
      _this.cart = [];
      _this.getOrdersRequest();
    })
  }

  getOrdersRequest(): void {
    var _this = this;
    this.http.post(
      '/api/getorders',
      {
        user_id: this.usrData._id
      }
    ).subscribe( (res: Response) => {
      _this.orders = res.json().reverse();
      console.log(_this.orders)
    })
  }
}
