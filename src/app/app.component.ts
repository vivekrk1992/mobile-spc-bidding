import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpServerServiceProvider } from '../providers/http-server-service/http-server-service';
import { FCM } from '@ionic-native/fcm';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpServerServiceProvider: HttpServerServiceProvider, private fcm: FCM) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      this.fcm.getToken().then((token) => {
        console.log('success');
        console.log(token);
        // alert(token);
        // prompt("Copy to clipboard: Ctrl+C, Enter", token);
        // Your best bet is to here store the token on the user's profile on the
        // Firebase database, so that when you want to send notifications to this 
        // specific user you can do it from Cloud Functions.
      });
      splashScreen.hide();
    });
  }
}
