import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { OrderTabsPage } from '../pages/order-tabs/order-tabs';
import { GrievancePage } from './../pages/grievance/grievance';
import { BuyerProfilePage } from './../pages/buyer-profile/buyer-profile';
import { OrderPage } from './../pages/order/order';
import {SaleOrderDetailsPage} from "../pages/sale-order-details/sale-order-details";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpServerServiceProvider } from '../providers/http-server-service/http-server-service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import {PipesModule} from "../pipes/pipes.module";
import { GlobalProvider } from '../providers/global/global';
import { Camera } from '@ionic-native/camera';
import { FileOpener } from '@ionic-native/file-opener'
import { File } from '@ionic-native/file'
import { FileTransfer } from '@ionic-native/file-transfer'
import { AppVersion } from '@ionic-native/app-version';
  
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    GrievancePage,
    SaleOrderDetailsPage,
    OrderPage,
    BuyerProfilePage,
    OrderTabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    GrievancePage,
    SaleOrderDetailsPage,
    OrderPage,
    BuyerProfilePage,
    OrderTabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServerServiceProvider,
    PhonegapLocalNotification,
    GlobalProvider,
    Camera,
    FileOpener,
    File,
    FileTransfer,
    AppVersion
  ]
})
export class AppModule {}
