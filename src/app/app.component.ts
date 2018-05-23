import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';
// import { HttpServerServiceProvider } from '../providers/http-server-service/http-server-service';
// import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';

  constructor(platform: Platform, statusBar: StatusBar, private fcm: FCM) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      // splashScreen.hide();

      // this.fcm.getToken().then(token => {
      //   let data = {'token': token};
      //   this.httpServerServiceProvider.sendFcmDeviceToken(data).subscribe(data => {
      //     alert('success');
      //   }, (error) => {
      //     alert(JSON.stringify(error));
      //   }
      //   );
      // }, (error) => {
      //   alert(JSON.stringify(error))
      // });
  
      this.fcm.onNotification().subscribe(data => {
        alert(JSON.stringify(data));
        if(data.wasTapped) {
          alert('received on background');
          alert(JSON.stringify(data));
        } else {
          alert('received on foreground');
          alert(JSON.stringify(data));
        }
      });
    });

    
  }
}
