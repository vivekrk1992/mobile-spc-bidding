import { InvoiceDashboardPage } from './../pages/contact/invoice-dashboard/invoice-dashboard';
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
import { MultiOrderPage } from './../pages/multi-order/multi-order';
import { SaleOrderDetailsPage } from "../pages/sale-order-details/sale-order-details";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpServerServiceProvider } from '../providers/http-server-service/http-server-service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { PipesModule } from "../pipes/pipes.module";
import { GlobalProvider } from '../providers/global/global';
import { Camera } from '@ionic-native/camera';
import { FileOpener } from '@ionic-native/file-opener'
import { File } from '@ionic-native/file'
import { FileTransfer } from '@ionic-native/file-transfer';
import { FCM } from '@ionic-native/fcm';
import { TimerComponent } from '../components/timer/timer';
import { ConfirmOrderPage } from '../pages/confirm-order/confirm-order';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

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
    OrderTabsPage,
    MultiOrderPage,
    InvoiceDashboardPage,
    TimerComponent,
    ConfirmOrderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    PipesModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
    OrderTabsPage,
    MultiOrderPage,
    InvoiceDashboardPage,
    ConfirmOrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServerServiceProvider,
    GlobalProvider,
    Camera,
    FileOpener,
    File,
    FileTransfer,
    FCM,
    Network,
    LocalNotifications
  ]
})
export class AppModule {}
