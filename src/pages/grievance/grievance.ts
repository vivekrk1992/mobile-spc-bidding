import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';


@IonicPage()
@Component({
  selector: 'page-grievance',
  templateUrl: 'grievance.html',
})
export class GrievancePage {
  sale_list: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider) {
    console.log(this.navParams.data);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad GrievancePage');
    this.httpServerServiceProvider.getSaleListFor3Days().subscribe(data => {
      console.log(data);
      this.sale_list = data;
    }, (error) => {
      console.log(error);
    });
  }

}
