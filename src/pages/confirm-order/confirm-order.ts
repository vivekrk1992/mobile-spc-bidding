import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-confirm-order',
  templateUrl: 'confirm-order.html',
})
export class ConfirmOrderPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  order_details: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider) {
    let myObservable = Observable.create(observer => {
      observer.next("hello");
    });

    myObservable.subscribe((data) => {
      console.log(data);
    });
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter ConfirmOrderPage');
    setTimeout(() => {
      this.timer.startTimer();
    }, 100)

    this.order_details = this.navParams.data
    console.log(this.order_details);
  }

  onDisapprove() {
    console.log('Disapprove');
    console.log(this.timer.hasFinished());
  }

  onConfirm() {
    console.log('Approve');
  }

}
