import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, App, Events, Platform } from 'ionic-angular';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  // toUser = {
  //   _id: '534b8e5aaa5e7afc1b23e69b',
  //   // pic: 'assets/img/avatar/ian-avatar.png',
  //   username: 'Venkman',
  // };

  // user = {
  //   _id: '534b8fb2aa5e7afc1b23e69c',
  //   // pic: 'assets/img/avatar/marty-avatar.png',
  //   username: 'Marty',
  // };

  // doneLoading = false;

  // messages = [
  //   {
  //     _id: 1,
  //     date: new Date(),
  //     userId: this.user._id,
  //     username: this.user.username,
  //     // pic: this.user.pic,
  //     text: 'OH CRAP!!'
  //   },
  //   {
  //     _id: 2,
  //     date: new Date(),
  //     userId: this.toUser._id,
  //     username: this.toUser.username,
  //     // pic: this.toUser.pic,
  //     text: 'what??'
  //   },
  //   {
  //     _id: 3,
  //     date: new Date(),
  //     userId: this.toUser._id,
  //     username: this.toUser.username,
  //     // pic: this.toUser.pic,
  //     text: 'Pretty long message with lots of content'
  //   },
  //   {
  //     _id: 4,
  //     date: new Date(),
  //     userId: this.user._id,
  //     username: this.user.username,
  //     // pic: this.user.pic,
  //     text: 'Pretty long message with even way more of lots and lots of content'
  //   },
  //   {
  //     _id: 5,
  //     date: new Date(),
  //     userId: this.user._id,
  //     username: this.user.username,
  //     // pic: this.user.pic,
  //     text: 'what??'
  //   },
  //   {
  //     _id: 6,
  //     date: new Date(),
  //     userId: this.toUser._id,
  //     username: this.toUser.username,
  //     // pic: this.toUser.pic,
  //     text: 'yes!'
  //   }
  // ];

  @ViewChild(Content) content: Content;

  public messageForm: any;
  chatBox: any;
  messages: any[] = [];
  conversation: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private app: App,
    private fcm: FCM, private events: Events, private ref: ChangeDetectorRef, private localNotifications: LocalNotifications, private platform: Platform) {
    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';

    this.events.subscribe('fcm_message', (data) => {
      data['is_client_message'] = false
      data['time_modified'] = new Date();
      this.messages.push(data);
      this.scrollToBottom();
      this.ref.detectChanges();
      this.localNotifications.schedule({
        id: 1,
        // text: 'Single ILocalNotification',
        sound: this.setSound(),
        data: {}
      });
      this.localNotifications.cancel(1);
    });
  }

  saveFcmDeviceTokenToServer() {
    this.fcm.getToken().then(token => {
      let data = { 'token': token };
      this.httpServerServiceProvider.sendFcmDeviceToken(data).subscribe(data => {
      }, (error) => {
      });
    }, (error) => {
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ChatPage');
    this.getConversation();
    this.saveFcmDeviceTokenToServer();
  }

  getConversation() {
    this.httpServerServiceProvider.getConversationDetails().subscribe((data) => {
      console.log(data);
      this.conversation = data;
      if (data.hasOwnProperty('messages')) {
        this.messages = data['messages']
      }
    }, (error) => {
      console.log(error);
    });
  }


  send(message) {
    if (message && message !== '') {
      let message_body = {};
      message_body['conv_id'] = this.conversation['id'];
      message_body['message'] = message;
      message_body['is_client_message'] = true;
      message_body['time_modified'] = new Date();
      this.httpServerServiceProvider.sendMessage(message_body).subscribe((data) => {
        console.log(data);
        this.messages.push(message_body);
        this.scrollToBottom();
      }, (error) => {
        console.log(error);
      });
      //   // this.messageService.sendMessage(chatId, message);

      //   const messageData =
      //   {
      //     toId: this.toUser._id,
      //     _id: 6,
      //     date: new Date(),
      //     userId: this.user._id,
      //     username: this.toUser.username,
      //     // pic: this.toUser.pic,
      //     text: message
      //   };

      //   this.messages.push(messageData);
      //   this.scrollToBottom();

      //   setTimeout(() => {
      //     const replyData =
      //     {
      //       toId: this.toUser._id,
      //       _id: 6,
      //       date: new Date(),
      //       userId: this.toUser._id,
      //       username: this.toUser.username,
      //       // pic: this.toUser.pic,
      //       text: 'Just a quick reply'
      //     };
      //     this.messages.push(replyData);
      //     this.scrollToBottom();
      //   }, 1000);
    }
    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }


  logout() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    }, () => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    });
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/message.ogg'
    }
  }

}
