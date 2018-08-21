import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'transaction-page-ng6';

  isLoggedIn(): boolean {
    return sessionStorage.getItem('usrInfo') !== null;
  }
}
