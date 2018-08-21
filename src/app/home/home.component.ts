import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products: any;
  loggedIn: boolean;

  constructor(private appComponent: AppComponent, private http: Http) {
    var newAnalyzers = [
      { title: "Diamond Smartlyte", store_id: "#DD0000", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Diamond-Smartlyte-312326.jpg?v=undefined" },
      { title: "Diamond Carelyte", store_id: "#DD0001", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Diamond-Carelyte-756391.jpg?v=undefined" },
      { title: "Diamond Prolyte", store_id: "#DD0002", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Diamond-Prolyte-557465.jpg?v=undefined" },
    ];
    var refAnalyzers = [
      { title: "Beckman AU680 w ISE", store_id: "#DD0003", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Beckman-AU680-w-ISE-191575.jpg?v=undefined" },
      { title: "Roche Cobas E411 Disk", store_id: "#DD0004", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Roche-Cobas-E411-Disk-458439.jpg?v=undefined" },
      { title: "Abbott Architect i2000", store_id: "#DD0005", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Abbott-Architect-i2000-239136.jpg?v=undefined" },
    ];
    var parts = [
      { title: "Assembly For Siemens Analyzers", store_id: "#DD0006", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Mixer-Rod-For-Siemens-Analyzers-431974.jpg?v=undefined" },
      { title: "UI Module For Radiometer Analyzers", store_id: "#DD0007", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/PCB-For-Radiometer-642418.jpg?v=undefined" },
      { title: "Barcode Scanner For Roche Analyzers", store_id: "#DD0008", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Clamp-For-Roche-Analyzers-554944.jpg?v=undefined" },
    ];
    var consumables = [
      { title: "Cuvettes", store_id: "#DD0009", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Cuvettes-274597.jpg?v=undefined" },
      { title: "HCT Electrode", store_id: "#DD0010", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Hct-Electrode-924625.jpg?v=undefined" },
      { title: "Glucose Electrode", store_id: "#DD0011", img_id: "https://www.diamonddiagnostics.com/store/uploads/productImg/Glucose-Electrode-463752.jpg?v=undefined" },
    ];

    this.products = [
      { title: "New Analyzers", content: newAnalyzers },
      { title: "Refurbished Analyzers", content: refAnalyzers },
      { title: "Parts on Demand", content: parts },
      { title: "Consumables", content: consumables }
    ];
    this.loggedIn = appComponent.isLoggedIn();
  }

  sendCartRequest(product: any): void {
    this.http.post(
      'api/appendcart',
      {
        user_id: JSON.parse(sessionStorage.getItem('usrInfo'))._id,
        product: product
      }
    ).subscribe( (res: Response) => {
      console.log(res.json())
    })
  }
}
