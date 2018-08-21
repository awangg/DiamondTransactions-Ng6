import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import { AppComponent } from '../app.component';
import { ALL_PRODUCTS } from './product.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: any;
  loggedIn: boolean;

  constructor(private appComponent: AppComponent, private http: Http) {
    this.products = ALL_PRODUCTS;
    var index = 0;
    this.products.forEach( function(product) {
      product.content.forEach( function(item) {
        item['store_id'] = '#DD-'+index;
        index++;
      })
    })
    this.loggedIn = appComponent.isLoggedIn();
  }

  sendCartRequest(product: any): void {
    this.http.post(
      'api/appendcart',
      {
        user_id: JSON.parse(sessionStorage.getItem('usrInfo'))._id,
        product: product,
        price: Math.floor(Math.random() * 1000) + 50
      }
    ).subscribe( (res: Response) => {
      console.log(res.json())
    })
  }
}
