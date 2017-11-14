import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  domestic_quotes: any[];
  
  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
    });
  }

  doRefresh(event) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      event.complete();
    }, (error) => {
      event.complete();
    });
  }

  logout() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
    }, (error) => {
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
    });
  }

}
