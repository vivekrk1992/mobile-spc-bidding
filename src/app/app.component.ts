import { Component } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';
import { GlobalProvider } from '../providers/global/global';
// import { MultiOrderPage } from '../pages/multi-order/multi-order';
// import { HttpServerServiceProvider } from '../providers/http-server-service/http-server-service';
// import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';

  constructor(platform: Platform, statusBar: StatusBar, private fcm: FCM,
    private events: Events, private global: GlobalProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();  
      this.fcm.onNotification().subscribe(data => {
        if(data.wasTapped) {
        } else {
          alert('data in foreground');
          this.events.publish('today_quote', data)
        }
      }, (error) => {
        console.log('error');
      });
    });
  }
}
