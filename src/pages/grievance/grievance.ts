import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-grievance',
  templateUrl: 'grievance.html',
})
export class GrievancePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrievancePage');
  }

}
