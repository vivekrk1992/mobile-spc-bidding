import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, App, Events, Platform, ModalController, LoadingController } from 'ionic-angular';
// import { FormBuilder, FormControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {


  @ViewChild(Content) content: Content;

  // public messageForm: any;
  chatBox: any;
  messages: any[] = [];
  conversation: any = null;
  bag_types: any[] = [];
  copra_brands: any[] = [];
  selected_file: any[] = [];
  openMenu: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private app: App,
    private fcm: FCM, private events: Events, private ref: ChangeDetectorRef, private localNotifications: LocalNotifications, private platform: Platform, private modalCtrl: ModalController,
    private loadingCtrl: LoadingController, private file: File, private fileOpener: FileOpener, private camera: Camera, private imagePicker: ImagePicker) {
    // this.messageForm = this.formBuilder.group({
    //   message: new FormControl('')
    // });
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
    this.bag_types = [];
    this.copra_brands = [];

    console.log('ionViewDidLoad ChatPage');
    // this.httpServerServiceProvider.getBagTypes().subscribe((data) => {
    //   console.log(data);
    //   this.bag_types = data;
    // }, (error) => {
    //   console.log(error);
    // });

    // this.httpServerServiceProvider.getCopraBrand().subscribe(data => {
    //   this.copra_brands = data;
    //   console.log(this.copra_brands);
    // }, (error) => {
    //   console.log(error);
    // });
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
        this.scrollToBottom();
      }
    }, (error) => {
      console.log(error);
    });
  }


  send(message, chat_category_id) {
    if (message && message !== '') {
      let message_body = {};
      message_body['conv_id'] = this.conversation['id'];
      message_body['message'] = message;
      message_body['is_client_message'] = true;
      message_body['message_category_id'] = chat_category_id;
      message_body['time_modified'] = new Date();
      this.httpServerServiceProvider.sendMessage(message_body).subscribe((data) => {
        console.log(data);
        this.messages.push(message_body);
        this.scrollToBottom();
      }, (error) => {
        console.log(error);
      });
    }
    this.chatBox = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }


  openQuestionnaire() {
    const questionnaire_model = this.modalCtrl.create('QuestionnaireModalPage', null, { cssClass: 'inset-modal' });
    questionnaire_model.onDidDismiss((question) => {
      console.log(question);
      if (question) {
        console.log('question avl!')
        let pre_defined_question: String = '';
        if (question['question']['id'] = 2) {
          pre_defined_question = question['question']['name'] + ' for ' + question['brand']['name'] + ' ' + question['bag']['name']
        }
        console.log(pre_defined_question);
        this.send(pre_defined_question, question['question']['id'])
        this.httpServerServiceProvider.postPredefinedQuestion(question).subscribe((data) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        });
      }
    });
    questionnaire_model.present();
  }

  openOrder() {
    const order_model = this.modalCtrl.create('OrderModalPage', {details: {copra: this.copra_brands, bags: this.bag_types}}, { cssClass: 'inset-modal' });
    order_model.onDidDismiss((order) => {
      console.log(order);
      if (order) {
        
      }
    });
    order_model.present();
  }

  openBid() {
    const bid_model = this.modalCtrl.create('BidModalPage', {details: {copra: this.copra_brands, bags: this.bag_types}}, { cssClass: 'inset-modal' });
    bid_model.onDidDismiss((bid) => {
      console.log(bid);
      if (bid) {

      }
    });
    bid_model.present();
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



  // doInfinite(): Promise<any> {
  //   console.log('Begin async operation');
  //   let conversation_dict = {}
  //   conversation_dict['conv_id'] = this.conversation['id'];
  //   this.httpServerServiceProvider.getConversationFor3Days(conversation_dict).subscribe((data) => {
  //     console.log(data);
  //     this.conversation = data;
  //     if (data.hasOwnProperty('messages')) {
  //       this.messages = data['messages']
  //       this.scrollToBottom();
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   });
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
        
  //       console.log('Async operation has ended');
  //       resolve();
  //     }, 500);
  //   })
  // }

  onUploadChange(ev) {
    this.selected_file = [];
    let myFile = ev.target.files;
    //let url = URL.createObjectURL(myFile);

    for (let i = 0; i < myFile.length; i++) {
      this.readFile(myFile[i]);
    }
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // this.selected_file.push(reader.result, file.type);
      this.selected_file.push(reader.result);
      // this.createOwnerThumbnail();
      this.uploadAttachmentsToServer(this.selected_file);
    };
    reader.readAsDataURL(file);
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }

  choosePicture() {
    this.selected_file = [];
    // this.imageThumbs = [];
    let options = {
      // maximumImagesCount: 10,
      quality: 75,
      outputType: 1
    }

    console.log(this.selected_file.length);
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);
        let base64Image = "data:image/jpeg;base64," + results[i];
        this.selected_file.push(base64Image);
        // this.createOwnerThumbnail();
      }
      if (this.selected_file.length != 0) {
        console.log('Image array is not empty');
        console.log(this.selected_file.length);
        this.uploadAttachmentsToServer(this.selected_file);
      }
    }, (err) => {
      alert(JSON.stringify(err))
    });
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.selected_file.push('data:image/jpeg;base64,' + imageData);
      this.uploadAttachmentsToServer(this.selected_file);
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

  uploadAttachmentsToServer(docs_array) {
    let message_body = {};
    message_body['conv_id'] = this.conversation['id'];
    message_body['message'] = '';
    message_body['is_client_message'] = true;
    message_body['time_modified'] = new Date();
    message_body['message_category_id'] = 1;
    message_body['user_id'] = 1;
    message_body['attachments'] = docs_array;
    this.httpServerServiceProvider.saveAttachments(message_body).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  onAttachmentClicked(attachment) {
    let loading = this.loadingCtrl.create();

    loading.present();

    console.log(attachment);
    let data_type = attachment['mime_type'].split(';base64');
    let mime = data_type[0].split('data:');
    console.log(data_type);
    console.log(mime);

    let filename: string = String(new Date().getTime()) + attachment['extension'];

    const binary_string = window.atob(attachment['attachment']);
    const binary_length = binary_string.length;
    const bytes = new Uint8Array(binary_length);
    for (let i = 0; i < binary_length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    this.platform.ready().then(() => {
      const blob: Blob = new Blob([bytes], { type: mime[1] });
      console.log(blob);

      this.file.writeFile(this.file.externalApplicationStorageDirectory, filename, blob, { replace: false })
        .then(() => {
          loading.dismiss();
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + filename, mime[1])
          // alert('File Downloaded to' + this.file.externalApplicationStorageDirectory);
        }).catch(() => {
          loading.dismiss();
        })
      })
      .catch((error) => {
        loading.dismiss();
        alert(JSON.stringify(error))
      })
  }
}
